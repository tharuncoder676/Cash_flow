import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  recordEnrolment,
  revokeEnrolmentByPaymentIntent,
} from "@/lib/enrolments";
import { sendEnrolmentConfirmationEmail } from "@/lib/email";
import type { Tier } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — the single source of truth for course access.
 *
 * Brief §12: "confirm that failed payments do not create active course
 * access". Access is granted here and nowhere else. The success page only
 * *reads* what this handler wrote; it never grants anything itself, because a
 * user can navigate to a success URL without having paid.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  // The raw body is required — parsing it first would break verification.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;

        // A completed session is not necessarily a paid one — bank debits and
        // some local methods settle later. Only "paid" grants a place.
        if (session.payment_status !== "paid") {
          console.info(
            `[webhook] session ${session.id} completed but unpaid (${session.payment_status}) — no access granted`,
          );
          break;
        }

        const { created, enrolment } = await recordEnrolment({
          email:
            session.customer_details?.email ?? session.customer_email ?? "",
          name: session.customer_details?.name ?? null,
          company: null,
          tier: (session.metadata?.tier as Tier) ?? "standard",
          amountMinor: session.amount_total ?? 0,
          currency: (session.currency ?? "usd").toUpperCase(),
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : (session.payment_intent?.id ?? null),
        });

        if (created) {
          console.info(
            `[webhook] enrolled ${enrolment.email} (${enrolment.tier}, ${enrolment.currency} ${enrolment.amountMinor / 100})`,
          );

          // Automated Onboarding & Confirmation Email to Enrolled Student
          try {
            await sendEnrolmentConfirmationEmail({
              to: enrolment.email,
              name: enrolment.name,
              enrolmentId: enrolment.id,
              tier: enrolment.tier,
              amountMinor: enrolment.amountMinor,
              currency: enrolment.currency,
            });
          } catch (emailErr) {
            console.error("[webhook] Failed to dispatch welcome email", emailErr);
          }
        }
        break;
      }

      case "checkout.session.async_payment_failed":
      case "checkout.session.expired": {
        const session = event.data.object;
        console.info(
          `[webhook] session ${session.id} ${event.type} — no access granted`,
        );
        // TODO(phase-two): abandoned-checkout follow-up, subject to consent.
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;

        // `refunded` is only true once the whole amount has gone back. A
        // partial refund (say, a goodwill discount) keeps the place.
        if (!charge.refunded) {
          console.info(`[webhook] partial refund on ${charge.id} — place kept`);
          break;
        }

        const paymentIntentId =
          typeof charge.payment_intent === "string"
            ? charge.payment_intent
            : (charge.payment_intent?.id ?? null);
        if (!paymentIntentId) {
          console.warn(`[webhook] refund ${charge.id} has no payment intent`);
          break;
        }

        const revoked = await revokeEnrolmentByPaymentIntent(paymentIntentId);
        console.info(
          revoked
            ? `[webhook] full refund — place withdrawn for ${revoked.email}`
            : `[webhook] full refund ${charge.id} — no matching enrolment`,
        );
        // TODO(phase-two): email the refund confirmation and disable the
        // learning-platform account.
        break;
      }

      default:
        break;
    }
  } catch (err) {
    // Return 500 so Stripe retries — recordEnrolment is idempotent on the
    // session id, so a retry cannot double-book a seat.
    console.error(`[webhook] handler failed for ${event.type}`, err);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
