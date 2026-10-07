import type { Metadata } from "next";
import Link from "next/link";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from "@/components/primitives";
import CurriculumExplorer from "@/components/CurriculumExplorer";
import ElectricBorder from "@/components/ElectricBorder";
import Mark from "@/components/Mark";
import StickyEnrol from "@/components/StickyEnrol";
import ContactBand from "@/components/ContactBand";
import Odometer from "@/components/Odometer";
import { countEnrolments } from "@/lib/enrolments";
import {
  cohortStartLabel,
  enrolCta,
  formatAED,
  formatUSD,
  resolveSeats,
  type EnrolCta,
} from "@/lib/pricing";
import { paymentsConfigured } from "@/lib/stripe";
import {
  carl,
  cohort,
  faqs,
  included,
  outcomes,
  pricing,
  scopeBoundary,
  site,
  suitability,
  contact,
  whatsappUrl,
  curriculumPdf,
} from "@/content/course";

export const metadata: Metadata = {
  title: "The founding cohort",
  description:
    "A four-week blended programme for owner-led SMEs. Build a 13-week cash-flow forecast you actually trust, with weekly live application sessions.",
  alternates: { canonical: "/course" },
};

export const dynamic = "force-dynamic";

export default async function CoursePage() {
  const seats = resolveSeats(await countEnrolments());
  const cta = enrolCta(seats, paymentsConfigured());

  return (
    <>
      {/* ============================================================ */}
      {/* Hero                                                          */}
      {/* ============================================================ */}
      <section className="bg-ink-700 py-16 text-paper-100 sm:py-24">
        <Container width="wide">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div data-reveal="up">
              <Eyebrow tone="cream" className="mb-6">
                Founding cohort · {pricing.cohortCapacity} places
              </Eyebrow>
              <h1 className="font-display text-[2.6rem] leading-[1.12] tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.9rem]">
                Build a 13-week forecast
                <br className="hidden lg:block" />{" "}
                <span className="italic text-gold-500">
                  you actually trust.
                </span>
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-pretty text-paper-300/75 sm:text-xl">
                Understand where your cash is going,{" "}
                <Mark tone="dark">see cash problems 13 weeks ahead</Mark>, and
                leave with a practical cash action plan.
              </p>

              <dl className="mt-11 grid max-w-xl grid-cols-2 gap-x-8 gap-y-7 border-t border-paper-100/15 pt-8 sm:grid-cols-4">
                {[
                  ["4 weeks", "Blended format"],
                  ["4 live", "Sessions with Carl"],
                  [`${pricing.cohortCapacity} max`, "Cohort size"],
                  ["~2½ hrs", "Per week"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="font-display text-2xl text-paper-100">
                      {v}
                    </dt>
                    <dd className="mt-1.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-paper-300/65">
                      {l}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Price card ------------------------------------------- */}
            <div
              data-reveal="up"
              style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
              className="lg:pt-4"
            >
              <PriceCard seats={seats} cta={cta} />
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/* The cost of poor cash visibility                              */}
      {/* ============================================================ */}
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div data-reveal="up">
            <SectionHeading
              eyebrow="Where most owners are"
              title="You find out in arrears."
            />
          </div>
          <div
            data-reveal="up"
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="space-y-5 text-[17px] leading-relaxed text-ink-400"
          >
            <p>
              The management accounts arrive three weeks after month end. By
              the time they show a problem, the problem is a month old and you
              have already committed to the next one.
            </p>
            <p>
              So the decisions get made on instinct. You delay a supplier
              because it feels safer. You chase an invoice because it is the
              one you happened to remember. You turn down work you could have
              funded, or take on work you could not.
            </p>
            <p className="text-ink-800">
              None of that is a knowledge problem. It is a visibility problem,
              and thirteen weeks of visibility changes every one of those
              decisions.
            </p>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* The transformation                                            */}
      {/* ============================================================ */}
      <Section tone="ink">
        <SectionHeading
          eyebrow="The transformation"
          tone="cream"
          title="What you’ll be able to do."
          lede="Four things, each of which survives contact with a busy month."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-xs bg-paper-100/10 sm:grid-cols-2">
          {outcomes.map((o, i) => (
            <div
              key={o.n}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
              className="lift bg-ink-700 p-8 lg:p-10"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-gold-500">
                {o.n}
              </span>
              <h3 className="mt-5 font-display text-2xl leading-snug text-paper-100">
                {o.title}
              </h3>
              <p className="mt-3.5 text-[16px] leading-relaxed text-paper-300/70">
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/* Curriculum                                                    */}
      {/* ============================================================ */}
      <Section tone="paper" id="curriculum">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="The four-week curriculum"
            title="Every lesson, in order."
            lede="Short self-paced lessons through the week, one live application session with Carl to put them to work."
            className="flex-1"
          />
          <div data-reveal="up" className="shrink-0">
            <ButtonLink href={curriculumPdf.href} variant="gold">
              Download the curriculum
            </ButtonLink>
            <p className="mt-2.5 text-center font-mono text-[10px] uppercase tracking-[0.13em] text-ink-400">
              PDF · {curriculumPdf.pages} pages · {curriculumPdf.size}
            </p>
          </div>
        </div>

        <div className="mt-14" data-reveal="up">
          <CurriculumExplorer />
        </div>

      </Section>

      {/* ============================================================ */}
      {/* Included                                                      */}
      {/* ============================================================ */}
      <Section tone="sand">
        <SectionHeading
          eyebrow="Exactly what is included"
          title="Everything you get."
          lede="The templates are built from the models Carl uses with fractional CFO clients. They are yours to keep."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-xs bg-ink-700/12 sm:grid-cols-2 lg:grid-cols-4">
          {included.map((item, i) => (
            <div
              key={item.title}
              data-reveal="up"
              style={{ "--reveal-delay": `${(i % 4) * 60}ms` } as React.CSSProperties}
              className="lift bg-paper-50 p-7"
            >
              <h3 className="font-display text-lg leading-snug text-ink-900">
                {item.title}
              </h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-400">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/* Format & dates                                                */}
      {/* ============================================================ */}
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div data-reveal="up">
            <SectionHeading
              eyebrow="Delivery format"
              title="How the four weeks actually run."
            />
            <dl className="mt-10 divide-y divide-ink-700/12 border-y border-ink-700/12">
              {[
                ["Cohort starts", cohortStartLabel()],
                ["Length", `${cohort.durationWeeks} weeks`],
                ["Lessons", "Short, self-paced, captioned video"],
                ["Live sessions", cohort.liveSession.cadence],
                ["Session length", cohort.liveSession.duration],
                ["Time zone", cohort.liveSession.timezone],
                ["Weekly commitment", cohort.weeklyCommitment],
                ["Cohort size", `${pricing.cohortCapacity} participants maximum`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                >
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
                    {k}
                  </dt>
                  <dd className="text-[15px] text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            data-reveal="up"
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="space-y-8"
          >
            {/* Suitability ------------------------------------------- */}
            <div className="rounded-xs border-t-2 border-gold-600 bg-paper-50 p-7 sm:p-8">
              <h3 className="font-display text-xl text-ink-900">
                This is for you if…
              </h3>
              <ul className="mt-5 space-y-3">
                {suitability.forYou.map((s) => (
                  <li key={s} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-px w-3.5 shrink-0 bg-gold-600"
                    />
                    <span className="text-[15px] leading-relaxed text-ink-400">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xs border-t-2 border-ink-400/40 bg-paper-200/70 p-7 sm:p-8">
              <h3 className="font-display text-xl text-ink-900">
                It isn’t for you if…
              </h3>
              <ul className="mt-5 space-y-3">
                {suitability.notForYou.map((s) => (
                  <li key={s} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-2.5 h-px w-3.5 shrink-0 bg-ink-400/50"
                    />
                    <span className="text-[15px] leading-relaxed text-ink-400">
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* Carl                                                          */}
      {/* ============================================================ */}
      <Section tone="ink">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div data-reveal="up">
            <Eyebrow tone="cream" className="mb-6">
              Your instructor
            </Eyebrow>
            <h2 className="font-display text-4xl leading-[1.12] text-paper-100 sm:text-[3rem]">
              {carl.name}
            </h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-500">
              {carl.credentials}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-paper-300/60">
              {carl.role}
            </p>
          </div>
          <div
            data-reveal="up"
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
            className="space-y-5 text-[16px] leading-relaxed text-paper-300/75"
          >
            {carl.bio.map((p) => (
              <p key={p.slice(0, 30)}>{p}</p>
            ))}
            <ButtonLink href="/about" variant="onDark" size="sm">
              More about Carl
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* Pricing / enrol                                               */}
      {/* ============================================================ */}
      <Section tone="sand" id="enrol">
        <SectionHeading
          eyebrow="Founding-cohort pricing"
          title="Two pricing tiers, fifteen total places."
          lede="The first five places are priced at USD 550. The price automatically shifts to USD 695 for the remaining ten founding places once the first five are taken."
          align="center"
        />

        {/* Founding cohort tiers ------------------------------------ */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2">
          <FoundingTierCard
            name={pricing.foundingFive.name}
            amount={pricing.foundingFive.amount}
            anchorPrice={pricing.foundingFive.anchorPrice}
            badge={
              seats.tier === "founding_five"
                ? `${seats.foundingRemaining} of ${pricing.foundingFive.seats} Available`
                : "Tier Completed"
            }
            active={seats.tier === "founding_five"}
            features={pricing.foundingFive.features}
            note="Limited to the first 5 participants."
          />

          <FoundingTierCard
            name={pricing.foundingCohort.name}
            amount={pricing.foundingCohort.amount}
            anchorPrice={pricing.foundingCohort.anchorPrice}
            badge={
              seats.tier === "founding_cohort"
                ? `${seats.remaining} of ${pricing.cohortCapacity} Places Left`
                : "Next Tier"
            }
            active={seats.tier === "founding_cohort"}
            features={pricing.foundingCohort.features}
            note="Limited to the next 10 participants."
          />
        </div>

        {/* Future regular cohort notice */}
        <div className="mx-auto mt-6 max-w-5xl rounded-xs border border-ink-700/12 bg-paper-50/80 p-5 sm:p-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
            Future regular cohort price: <span className="font-semibold text-ink-900">USD 995</span> (standard price after the founding cohort finishes)
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-[15px] leading-relaxed text-ink-400">
            {pricing.taxNote} {pricing.paymentTerms}{" "}
            {seats.soldOut
              ? "This founding cohort is now full."
              : `${seats.remaining} of ${pricing.cohortCapacity} total founding places remain.`}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={cta.href}
              variant={cta.payable ? "primary" : "gold"}
            >
              {cta.label}
            </ButtonLink>
            <ButtonLink href="/diagnostic" variant="ghost">
              Not sure yet? Take the diagnostic
            </ButtonLink>
          </div>
        </div>

        {/* Scope boundary ------------------------------------------- */}
        <div className="mx-auto mt-16 max-w-3xl rounded-xs border border-ink-700/15 bg-paper-50 p-7 sm:p-9">
          <Eyebrow className="mb-4">Read this before you buy</Eyebrow>
          <h3 className="font-display text-2xl text-ink-900">
            {scopeBoundary.title}
          </h3>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-400">
            {scopeBoundary.body}
          </p>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* FAQs                                                          */}
      {/* ============================================================ */}
      <Section tone="paper" width="narrow">
        <SectionHeading
          eyebrow="Questions"
          title="Everything else."
          align="center"
        />
        <div className="mt-12 divide-y divide-ink-700/12 border-y border-ink-700/12">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-display text-xl text-ink-900 marker:hidden">
                {faq.q}
                <span
                  aria-hidden="true"
                  className="relative h-3 w-3 shrink-0 text-gold-700"
                >
                  <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                  <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-300 group-open:rotate-90" />
                </span>
              </summary>
              <p className="mt-4 pr-10 text-[16px] leading-relaxed text-ink-400">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-12 rounded-xs border border-ink-700/15 bg-paper-50 p-7 text-center sm:p-8">
          <h3 className="font-display text-xl text-ink-900">
            Still not sure it’s right for you?
          </h3>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-400">
            Ask before you pay. {contact.replyPromise}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={whatsappUrl(
                `Hi Carl — I have a question about the ${site.name} founding cohort.`,
              )}
              variant="ghost"
              size="sm"
            >
              Ask on WhatsApp
            </ButtonLink>
            <ButtonLink
              href={`mailto:${contact.email}`}
              variant="ghost"
              size="sm"
            >
              Email Carl
            </ButtonLink>
          </div>
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
            {contact.hours}
          </p>
        </div>

        <p className="mt-8 text-center text-[15px] text-ink-400">
          Or{" "}
          <Link
            href="/faq"
            className="text-gold-700 underline underline-offset-4"
          >
            read the full FAQs
          </Link>
          .
        </p>
      </Section>

      {/* ============================================================ */}
      {/* Final CTA                                                     */}
      {/* ============================================================ */}
      <ContactBand />

      <StickyEnrol
        price={formatUSD(seats.amount)}
        remaining={seats.remaining}
        capacity={pricing.cohortCapacity}
        soldOut={seats.soldOut}
        cta={cta}
      />

      <section className="bg-ink-900 py-24 sm:py-32">
        <Container width="narrow" className="text-center">
          <Eyebrow tone="cream" className="mb-7">
            {cohortStartLabel()}
          </Eyebrow>
          <h2 className="font-display text-4xl leading-[1.12] tracking-[-0.025em] text-balance text-paper-100 sm:text-5xl">
            Thirteen weeks of warning.
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-paper-300/70">
            {seats.soldOut
              ? "This cohort is full. The waitlist gets first refusal on the next one."
              : `${seats.remaining} of ${pricing.cohortCapacity} places remain at ${formatUSD(seats.amount)}.`}
          </p>
          <div className="mt-10">
            <ButtonLink href={cta.href} variant="gold">
              {cta.label}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function PriceCard({
  seats,
  cta,
}: {
  seats: ReturnType<typeof resolveSeats>;
  cta: EnrolCta;
}) {
  return (
    <div className="rounded-xs border border-paper-100/15 bg-ink-900/60 p-7 backdrop-blur-sm sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-300/65">
          {seats.tierLabel}
        </p>
        <span className="rounded-xs bg-gold-500/20 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-gold-400">
          Regular: USD {seats.anchorPrice}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <Odometer
          value={seats.amount.toLocaleString("en-US")}
          prefix="USD "
          className="tabular font-display text-[2.8rem] leading-none text-paper-100 sm:text-[3.2rem]"
        />
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-paper-300/65">
        {pricing.taxNote} {pricing.paymentTerms}
      </p>

      <div className="mt-6 border-t border-paper-100/12 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-300/65">
            Founding cohort places left
          </span>
          <span className="tabular font-display text-xl text-gold-500">
            {seats.remaining} / {pricing.cohortCapacity}
          </span>
        </div>
        {/* An honest capacity bar */}
        <div
          className="mt-3 h-1 w-full overflow-hidden rounded-full bg-paper-100/12"
          role="img"
          aria-label={`${seats.taken} of ${pricing.cohortCapacity} places taken`}
        >
          <div
            className="h-full bg-gold-500 transition-all duration-500"
            style={{
              width: `${(seats.taken / pricing.cohortCapacity) * 100}%`,
            }}
          />
        </div>
      </div>

      <ButtonLink href={cta.href} variant="gold" className="mt-7 w-full">
        {cta.label}
      </ButtonLink>

      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-paper-300/65">
        {cohortStartLabel()}
      </p>
    </div>
  );
}

function FoundingTierCard({
  name,
  amount,
  anchorPrice,
  badge,
  active,
  features,
  note,
}: {
  name: string;
  amount: number;
  anchorPrice: number;
  badge: string;
  active: boolean;
  features: readonly string[];
  note: string;
}) {
  const card = (
    <div
      className={`flex flex-col justify-between rounded-xs border p-8 transition-colors ${
        active
          ? "border-gold-600/70 bg-paper-50"
          : "border-ink-700/12 bg-paper-50/50 opacity-80"
      }`}
    >
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-400">
            {name}
          </p>
          <span
            className={`rounded-xs px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
              active
                ? "bg-gold-500/20 text-gold-800 font-semibold"
                : "bg-ink-700/8 text-ink-400"
            }`}
          >
            {badge}
          </span>
        </div>
        <div className="mt-5 flex items-baseline gap-3">
          <p className="tabular font-display text-[2.5rem] leading-none text-ink-900 sm:text-[2.8rem]">
            USD {amount}
          </p>
          <span className="text-[13px] text-ink-400 line-through">
            USD {anchorPrice}
          </span>
        </div>
        <p className="mt-3 text-[14px] font-medium text-ink-700">{note}</p>
        <ul className="mt-6 space-y-2.5 border-t border-ink-700/10 pt-5 text-[14.5px] leading-relaxed text-ink-800">
          {features.map((f) => (
            <li key={f} className="flex gap-2.5">
              <span aria-hidden="true" className="text-gold-600 font-bold">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 pt-4 border-t border-ink-700/8">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-400">
          {active ? "Currently available for checkout" : "Auto-activates based on places"}
        </p>
      </div>
    </div>
  );

  return active ? <ElectricBorder>{card}</ElectricBorder> : card;
}
