import { NextResponse } from "next/server";
import { getStripe, getSiteUrl, paymentsConfigured } from "@/lib/stripe";
import { countEnrolments } from "@/lib/enrolments";
import { resolveSeats, toMinorUnits, cohortStartLabel } from "@/lib/pricing";
import { pricing, site, included } from "@/content/course";
import { isValidEmail } from "@/lib/leads";
import {
  RequestBodyError,
  clientIp,
  isSameOrigin,
  rateLimit,
  readJsonBody,
} from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Create an embedded Checkout Session for one place in the founding cohort.
 *
 * The price is resolved on the server from the number of places already sold.
 * The client never sends an amount — if it did, a user could pay AED 1 for a
 * seat by editing the request.
 */
export async function POST(request: Request) {
  if (!paymentsConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 },
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Every call creates a real Stripe Checkout Session. The embedded checkout
  // can re-request one on remount, so this is generous for a person and
  // still stops a script minting sessions in a loop.
  const limited = rateLimit(`checkout:${clientIp(request)}`, 10, 10 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(request, 2_000);
  } catch (err) {
    const status = err instanceof RequestBodyError ? err.status : 400;
    return NextResponse.json({ error: "Invalid request." }, { status });
  }

  // Optional: Stripe collects the email itself. If one is sent it must be a
  // real address — the previous check only asked whether it contained "@".
  const email = isValidEmail(body.email)
    ? body.email.trim().toLowerCase()
    : undefined;

  const taken = await countEnrolments();
  const seats = resolveSeats(taken);

  if (seats.soldOut) {
    return NextResponse.json(
      { error: "sold_out", waitlistUrl: "/waitlist" },
      { status: 409 },
    );
  }

  const stripe = getStripe();
  const siteUrl = getSiteUrl();

  const description = [
    `${cohortStartLabel()}.`,
    `${pricing.paymentTerms}`,
    `Includes: ${included.slice(0, 4).map((i) => i.title.toLowerCase()).join(", ")} and more.`,
  ].join(" ");

  try {
    const session = await stripe.checkout.sessions.create({
      // "embedded" was renamed "embedded_page" in the Stripe API. The SDK's
      // ui_mode type is a union with a catch-all string, so the old value
      // type-checked and built cleanly and only failed at the API call.
      ui_mode: "embedded_page",
      mode: "payment",
      // Stripe returns to this URL with the session id so the success page
      // can confirm the payment server-side before showing anything.
      return_url: `${siteUrl}/enrol/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: pricing.currency.toLowerCase(),
            unit_amount: toMinorUnits(seats.amount),
            product_data: {
              name: `${site.name} — founding cohort`,
              description,
            },
          },
        },
      ],
      // Carried through to the webhook, which is the only thing that grants
      // access. Keeps the seat price auditable after the fact.
      metadata: {
        product: "cash-flow-mastery-founding",
        tier: seats.tier,
        seatNumber: String(taken + 1),
      },
      payment_intent_data: {
        description: `${site.name} founding cohort — place ${taken + 1}`,
      },
      consent_collection: { terms_of_service: "required" },
      custom_text: {
        terms_of_service_acceptance: {
          message: `I accept the [course terms of sale](${siteUrl}/legal/terms) and the [refund policy](${siteUrl}/legal/refunds).`,
        },
        submit: { message: pricing.paymentTerms },
      },
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
      tier: seats.tier,
      amount: seats.amount,
      currency: pricing.currency,
    });
  } catch (err) {
    console.error("[checkout] failed to create session", err);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 500 },
    );
  }
}
