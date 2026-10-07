import type { Metadata } from "next";
import Link from "next/link";
import CheckoutPanel from "@/components/CheckoutPanel";
import { Container, Eyebrow } from "@/components/primitives";
import { countEnrolments } from "@/lib/enrolments";
import { paymentsConfigured } from "@/lib/stripe";
import { cohortStartLabel, formatAED, resolveSeats } from "@/lib/pricing";
import {
  cohort,
  contact,
  included,
  pricing,
  scopeBoundary,
  site,
  whatsappUrl,
} from "@/content/course";

/**
 * Dynamic, because the tab title should not promise payment on a page that is
 * currently offering the waitlist.
 */
export async function generateMetadata(): Promise<Metadata> {
  const open = paymentsConfigured() && !resolveSeats(await countEnrolments()).soldOut;
  return {
    title: open ? "Secure your place" : "Enrolment opens shortly",
    description:
      "Join the Cash Flow Mastery founding cohort. Price, currency, VAT treatment, inclusions and refund terms shown before payment.",
    robots: { index: false, follow: true },
  };
}

export const dynamic = "force-dynamic";

export default async function EnrolPage() {
  const taken = await countEnrolments();
  const seats = resolveSeats(taken);
  const configured = paymentsConfigured();
  const open = configured && !seats.soldOut;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

  return (
    <div className="bg-paper-200">
      <Container width="wide" className="py-14 sm:py-20">
        <div className="mb-10">
          <Eyebrow className="mb-4">
            {open ? "Step 2 of 2 — secure payment" : "Enrolment"}
          </Eyebrow>
          <h1 className="font-display text-4xl leading-[1.12] tracking-[-0.025em] text-ink-900 sm:text-5xl">
            {open ? "Secure your place" : "Enrolment opens shortly"}
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
          {/* ---------------------------------------------------------- */}
          {/* Order summary — brief §6 requires all of this BEFORE payment */}
          {/* ---------------------------------------------------------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xs border border-ink-700/12 bg-paper-50">
              <div className="border-b border-ink-700/10 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-xl text-ink-900">
                    {site.name}
                  </h2>
                  <span className="rounded-xs bg-gold-500/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-gold-800">
                    Regular: ${seats.anchorPrice}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
                  {seats.tierLabel} · {cohort.durationWeeks} weeks
                </p>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="tabular font-display text-4xl text-ink-900">
                    USD {seats.amount}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
                    one payment
                  </span>
                </div>

                {seats.tier === "founding_five" ? (
                  <p className="seat-live mt-3 inline-block rounded-xs bg-gold-500/18 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-800 font-medium">
                    {pricing.foundingFive.label} · {seats.foundingRemaining} of {pricing.foundingFive.seats} left at USD 550
                  </p>
                ) : (
                  <p className="seat-live mt-3 inline-block rounded-xs bg-gold-500/18 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-800 font-medium">
                    {pricing.foundingCohort.label} · {seats.remaining} of {pricing.cohortCapacity} left at USD 695
                  </p>
                )}

                <p className="mt-4 text-[13px] leading-relaxed text-ink-400">
                  {pricing.taxNote}
                </p>
              </div>

              {/* Key terms ------------------------------------------- */}
              <dl className="divide-y divide-ink-700/10 border-b border-ink-700/10">
                {[
                  ["Cohort starts", cohortStartLabel()],
                  ["Format", `${cohort.durationWeeks} weeks, blended`],
                  ["Live sessions", `${cohort.durationWeeks} with Carl`],
                  ["Weekly time", cohort.weeklyCommitment],
                  ["Cohort capacity", `${seats.remaining} of ${pricing.cohortCapacity} places remaining`],
                  ["Course access", `${cohort.accessPeriodMonths} months replays & reusable templates`],
                  ["Payment", pricing.paymentTerms],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-5 px-6 py-3.5 sm:px-7"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-[0.13em] text-ink-400">
                      {label}
                    </dt>
                    <dd className="text-right text-[14px] leading-snug text-ink-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Inclusions ------------------------------------------ */}
              <div className="p-6 sm:p-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
                  What’s included
                </p>
                <ul className="mt-4 space-y-2.5">
                  {included.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-px w-3 shrink-0 bg-gold-600"
                      />
                      <span className="text-[14px] leading-relaxed text-ink-800">
                        {item.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Refund terms ---------------------------------------- */}
              <div className="border-t border-ink-700/10 bg-paper-200/50 p-6 sm:p-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
                  Refund and Cancellation Policy
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-400">
                  {pricing.refundPolicy} Read the full{" "}
                  <Link
                    href="/legal/refunds"
                    target="_blank"
                    className="text-gold-700 underline underline-offset-4"
                  >
                    refund policy
                  </Link>
                  ,{" "}
                  <Link
                    href="/legal/terms"
                    target="_blank"
                    className="text-gold-700 underline underline-offset-4"
                  >
                    terms of sale
                  </Link>
                  , and{" "}
                  <Link
                    href="/legal/disclaimer"
                    target="_blank"
                    className="text-gold-700 underline underline-offset-4"
                  >
                    training disclaimer
                  </Link>
                  .
                </p>
              </div>
            </div>

            <p className="mt-5 text-[13px] leading-relaxed text-ink-400">
              {scopeBoundary.body}
            </p>
          </aside>

          {/* ---------------------------------------------------------- */}
          {/* Payment                                                     */}
          {/* ---------------------------------------------------------- */}
          <div>
            {seats.soldOut ? (
              <Panel
                title="This cohort is full"
                body={`All ${pricing.cohortCapacity} places have been taken. Join the waitlist and you'll be offered a place in the next cohort before it opens publicly.`}
                href="/waitlist"
                cta="Join the Founding Cohort Waitlist"
              />
            ) : !configured ? (
              <Panel
                title="Enrolment opens shortly"
                body="Online payment is being finalised for this cohort. Join the waitlist and you'll be sent the payment link the moment places open — ahead of any public announcement."
                href="/waitlist"
                cta="Join the Founding Cohort Waitlist"
              />
            ) : (
              <>
                <CheckoutPanel publishableKey={publishableKey} />
                <p className="mt-5 text-center text-[13px] leading-relaxed text-ink-400">
                  Payments are processed by Stripe. Your card details are
                  entered directly with Stripe and are never stored by{" "}
                  {site.name}.
                </p>
                <p className="mt-4 text-center text-[13px] leading-relaxed text-ink-400">
                  Something unclear before you pay?{" "}
                  <a
                    href={whatsappUrl(
                      `Hi Carl — I'm about to book a place on ${site.name} and have a question.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-700 underline underline-offset-4"
                  >
                    Message Carl on WhatsApp
                  </a>{" "}
                  or call{" "}
                  <a
                    href={`tel:+${contact.phoneE164}`}
                    className="text-gold-700 underline underline-offset-4"
                  >
                    {contact.phone}
                  </a>
                  . {contact.hours}.
                </p>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

function Panel({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-xs border border-ink-700/15 bg-paper-50 p-8 text-center sm:p-12">
      <h2 className="font-display text-3xl leading-tight text-ink-900">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[16px] leading-relaxed text-ink-400">
        {body}
      </p>
      <Link
        href={href}
        className="mt-8 inline-flex items-center justify-center whitespace-nowrap rounded-xs bg-ink-700 px-7 py-4 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-paper-100 transition-colors hover:bg-ink-900"
      >
        {cta}
      </Link>
    </div>
  );
}
