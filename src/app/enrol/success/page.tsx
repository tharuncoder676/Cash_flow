import type { Metadata } from "next";
import { Container, Eyebrow, ButtonLink } from "@/components/primitives";
import { getStripe, paymentsConfigured } from "@/lib/stripe";
import { findEnrolmentBySession } from "@/lib/enrolments";
import { cohortStartLabel, formatUSD } from "@/lib/pricing";
import { cohort, contact, site, whatsappUrl } from "@/content/course";

export const metadata: Metadata = {
  // Neutral: this route also renders the "payment not completed" state, and a
  // tab reading "You're in" on a failed payment would be actively misleading.
  title: "Payment confirmation",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Status = "paid" | "processing" | "unpaid" | "unknown";

/**
 * Payment confirmation.
 *
 * This page only *reports* what Stripe says — it never grants access. Access
 * is written by the webhook, so someone opening this URL with a made-up
 * session id sees nothing but an error.
 */
export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  let status: Status = "unknown";
  let email: string | null = null;
  let amountLabel: string | null = null;

  if (sessionId && paymentsConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      email = session.customer_details?.email ?? null;

      if (session.payment_status === "paid") {
        status = "paid";
        if (session.amount_total != null) {
          amountLabel = formatUSD(session.amount_total / 100);
        }
      } else if (session.status === "open") {
        status = "unpaid";
      } else {
        status = "processing";
      }
    } catch {
      status = "unknown";
    }
  }

  // Has the webhook landed yet? Stripe usually beats the redirect, but not
  // always — so a paid session with no record yet is "confirming", not an
  // error the buyer should worry about.
  const enrolment = sessionId ? await findEnrolmentBySession(sessionId) : null;

  if (status === "unknown" || status === "unpaid") {
    return (
      <Shell
        eyebrow="Payment not completed"
        title={
          status === "unpaid"
            ? "That payment wasn’t finished"
            : "We couldn’t find that payment"
        }
      >
        <p className="mt-6 text-[17px] leading-relaxed text-ink-400">
          {status === "unpaid"
            ? "Your place isn’t reserved yet — nothing has been charged. You can pick up where you left off."
            : "This confirmation link isn’t valid. If you have been charged, forward the Stripe receipt and we will sort it out the same day."}
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/enrol">Back to checkout</ButtonLink>
          <ButtonLink href={`mailto:${site.contactEmail}`} variant="ghost">
            Email support
          </ButtonLink>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      eyebrow={cohortStartLabel()}
      title={
        <>
          You’re in.
          <br />
          <span className="italic text-gold-600">Place confirmed.</span>
        </>
      }
    >
      <p className="mt-7 text-[17px] leading-relaxed text-ink-400">
        {status === "processing"
          ? "Your payment is being confirmed by the bank. This can take a few hours — we will email you the moment it clears."
          : `Thank you. Your place in the ${site.name} founding cohort is secured${
              amountLabel ? ` (${amountLabel} paid)` : ""
            }.`}
      </p>

      {email && (
        <p className="mt-4 text-[15px] leading-relaxed text-ink-400">
          A receipt is on its way to{" "}
          <span className="text-ink-900">{email}</span>.
        </p>
      )}

      {/* What happens next -------------------------------------------- */}
      <ol className="mt-12 divide-y divide-ink-700/12 border-y border-ink-700/12">
        {[
          {
            t: "Check your inbox",
            b: "Your receipt and a welcome email from Carl arrive within a few minutes. If nothing lands, check spam before emailing us.",
          },
          {
            t: "Download the workbook",
            b: "The welcome email carries the 13-week forecast template and the Cash Visibility Diagnostic. Run the diagnostic before week 1 — it sets your baseline.",
          },
          {
            t: "Put the live sessions in your diary",
            b: `${cohort.liveSession.cadence}, ${cohort.liveSession.duration}, in ${cohort.liveSession.timezone}. Dates and joining links are confirmed by email before the cohort starts.`,
          },
          {
            t: "Bring your own numbers",
            b: "The course only works on real figures. Have your bank balance, sales ledger and supplier balances to hand for week 1.",
          },
        ].map((step, i) => (
          <li key={step.t} className="flex gap-6 py-6">
            <span className="font-mono text-[11px] tracking-[0.15em] text-gold-700">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-xl text-ink-900">{step.t}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-400">
                {step.b}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {!enrolment && status === "paid" && (
        <p className="mt-8 rounded-xs border border-ink-700/12 bg-paper-200/60 p-5 text-[14px] leading-relaxed text-ink-400">
          Your payment has gone through and your enrolment is being confirmed
          in the background. Nothing more is needed from you — the welcome
          email follows shortly.
        </p>
      )}

      <p className="mt-10 text-[14px] leading-relaxed text-ink-400">
        Anything not right? Email{" "}
        <a
          href={`mailto:${contact.email}`}
          className="text-gold-700 underline underline-offset-4"
        >
          {contact.email}
        </a>{" "}
        or message{" "}
        <a
          href={whatsappUrl(
            `Hi Carl — I've just booked a place on ${site.name}.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold-700 underline underline-offset-4"
        >
          {contact.phone} on WhatsApp
        </a>
        . {contact.hours}.
      </p>
    </Shell>
  );
}

function Shell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-paper-200 py-20 sm:py-28">
      <Container width="narrow">
        <Eyebrow className="mb-6">{eyebrow}</Eyebrow>
        <h1 className="font-display text-[2.6rem] leading-[1.12] tracking-[-0.025em] text-ink-900 sm:text-5xl lg:text-[3.4rem]">
          {title}
        </h1>
        {children}
      </Container>
    </div>
  );
}
