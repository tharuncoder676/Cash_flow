import type { Metadata } from "next";
import ForecastModel from "@/components/ForecastModel";
import CashFlowStory from "@/components/CashFlowStory";
import Portrait from "@/components/Portrait";
import Mark from "@/components/Mark";
import ProximityText from "@/components/ProximityText";
import LedgerRail from "@/components/LedgerRail";
import ContactBand from "@/components/ContactBand";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from "@/components/primitives";
import {
  carl,
  outcomes,
  promise,
  scopeBoundary,
  suitability,
  weeks,
  cohort,
  faqs,
  reframe,
  curriculumPdf,
} from "@/content/course";

export const metadata: Metadata = {
  title: "Cash Flow Mastery — See cash problems 13 weeks before they arrive",
  description: promise.core,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <LedgerRail
        sections={[
          { id: "why", label: "The problem" },
          { id: "reframe", label: "The reframe" },
          { id: "outcomes", label: "Outcomes" },
          { id: "who", label: "Who it's for" },
          { id: "programme", label: "The four weeks" },
          { id: "carl", label: "Carl" },
          { id: "diagnostic", label: "Free diagnostic" },
          { id: "contact", label: "Talk to Carl" },
        ]}
      />

      {/* ============================================================ */}
      {/* Hero                                                          */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-paper-200">
        {/* A single hairline grid, echoing ledger paper. No stock imagery. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(11,30,69,0.055) 1px, transparent 1px)",
            backgroundSize: "88px 100%",
          }}
        />
        <Container width="wide" className="relative py-10 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
            {/* Copy ------------------------------------------------- */}
            <div data-reveal="up">
              <Eyebrow
                className="mb-5"
                data-reveal="fade"
              >
                A four-week programme for owner-led SMEs
              </Eyebrow>

              {/* Each line masks up independently — the signature move,
                  used only on the two biggest headlines on the site. */}
              <h1
                aria-label="Profitable on paper. Tight on cash."
                className="flex flex-col font-display text-[2.5rem] leading-[1.12] tracking-[-0.03em] text-balance text-ink-900 sm:text-[3.4rem] lg:text-[3.75rem]"
              >
                <span className="block">
                  <span className="block" data-reveal="mask">
                    <ProximityText text="Profitable on paper." />
                  </span>
                </span>
                <span className="block">
                  <span
                    className="block italic text-gold-600"
                    data-reveal="mask"
                    style={{ "--reveal-delay": "110ms" } as React.CSSProperties}
                  >
                    <ProximityText text="Tight on cash." />
                  </span>
                </span>
              </h1>

              <p
                className="mt-5 max-w-xl text-[17px] leading-[1.6] text-pretty text-ink-400 sm:text-[18px]"
                data-reveal="up"
                style={{ "--reveal-delay": "260ms" } as React.CSSProperties}
              >
                {promise.core}
              </p>

              <div
                className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
                data-reveal="up"
                style={{ "--reveal-delay": "360ms" } as React.CSSProperties}
              >
                <ButtonLink href="/course">See the programme</ButtonLink>
                <ButtonLink href="/diagnostic" variant="ghost">
                  Start with the free diagnostic
                </ButtonLink>
              </div>

              <dl
                className="mt-8 grid max-w-lg grid-cols-3 gap-6 border-t border-ink-700/12 pt-5"
                data-reveal="up"
                style={{ "--reveal-delay": "460ms" } as React.CSSProperties}
              >
                {[
                  { n: 4, unit: " weeks", label: "Blended, part-time" },
                  { n: 13, unit: " weeks", label: "Of forward visibility" },
                  {
                    n: cohort.durationWeeks,
                    unit: " live",
                    label: "Sessions with Carl",
                  },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-xl text-ink-900 sm:text-2xl">
                      <span
                        className="count"
                        data-count={stat.n}
                        data-count-suffix={stat.unit}
                      >
                        {stat.n}
                        {stat.unit}
                      </span>
                    </dt>
                    <dd className="mt-1.5 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-ink-400">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* The model -------------------------------------------- */}
            <div data-reveal="up" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
              <ForecastModel />
            </div>
          </div>
        </Container>
      </section>

      {/* ============================================================ */}
      {/* The problem                                                   */}
      {/* ============================================================ */}
      <Section tone="paper" id="why">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
          <div data-reveal="up">
            <SectionHeading
              eyebrow="The gap nobody budgets for"
              title={
                <>
                  Why profitable businesses
                  <br className="hidden sm:block" /> still run short of cash
                </>
              }
            />
            <div className="mt-5 space-y-4 text-[16.5px] leading-[1.62] text-ink-400">
              <p>
                A sale is recorded the day you invoice it. The cash lands sixty
                days later — sometimes ninety. Meanwhile the supplier, the
                payroll and the rent all arrive on time.
              </p>
              <p>
                Profit measures whether the work was worth doing. Cash measures
                whether you can keep doing it. They are different questions, and
                the second one is the one that closes businesses.
              </p>
              <p className="text-ink-800">
                <Mark>Growth makes it worse, not better.</Mark> Every new order
                funds itself out of your bank account first.
              </p>
            </div>
          </div>

          <div
            data-reveal="up"
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
          >
            <CashFlowStory />
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* The reframe — the emotional beat between problem and offer.   */}
      {/* ============================================================ */}
      <Section tone="sand" id="reframe">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <div data-reveal="up">
            <Eyebrow className="mb-6">{reframe.eyebrow}</Eyebrow>
            <h2 className="font-display text-[2.1rem] leading-[1.12] tracking-[-0.02em] text-balance text-ink-900 sm:text-5xl">
              You are not{" "}
              <Mark display>bad with numbers</Mark>.
            </h2>
            <div className="mt-5 space-y-4 text-[16.5px] leading-[1.62] text-ink-400">
              {reframe.body.map((para) => (
                <p key={para.slice(0, 28)}>{para}</p>
              ))}
            </div>
          </div>

          {/* The three things every sceptical owner is actually thinking. */}
          <dl
            data-reveal="up"
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
            className="divide-y divide-ink-700/12 self-start border-y border-ink-700/12"
          >
            {reframe.objections.map((o) => (
              <div key={o.q} className="py-6">
                <dt className="font-display text-xl leading-snug text-ink-900">
                  {o.q}
                </dt>
                <dd className="mt-3 text-[16px] leading-relaxed text-ink-400">
                  {o.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* Four outcomes                                                 */}
      {/* ============================================================ */}
      <Section tone="ink" id="outcomes">
        <SectionHeading
          eyebrow="What you leave with"
          tone="cream"
          title="Four outcomes, not four certificates."
          lede="Each one is something you can do on the Monday after the course ends."
        />

        <div className="mt-7 grid gap-px overflow-hidden rounded-xs bg-paper-100/10 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((o, i) => (
            <div
              key={o.n}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}
              className="lift group relative bg-ink-700 p-5 transition-colors duration-300 hover:bg-ink-600 sm:p-6 lg:p-7"
            >
              <span className="font-mono text-[11px] tracking-[0.2em] text-gold-500">
                {o.n}
              </span>
              <h3 className="mt-5 font-display text-[1.45rem] leading-snug text-paper-100">
                {o.title}
              </h3>
              <p className="mt-3.5 text-[15px] leading-relaxed text-paper-300/70">
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/* Suitability                                                   */}
      {/* ============================================================ */}
      <Section tone="sand" id="who">
        <SectionHeading
          eyebrow="Honest qualification"
          title="Who this is for — and who it isn’t."
          lede="A cohort of fifteen only works if the right fifteen are in it. Read the right-hand column properly."
        />

        <div className="mt-7 grid gap-5 lg:grid-cols-2 lg:gap-8">
          <div
            data-reveal="up"
            className="rounded-xs border-t-2 border-gold-600 bg-paper-50 p-5 sm:p-7"
          >
            <h3 className="font-display text-2xl text-ink-900">
              This is for you if…
            </h3>
            <ul className="mt-6 space-y-4">
              {suitability.forYou.map((item) => (
                <li key={item} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-4 shrink-0 bg-gold-600"
                  />
                  <span className="text-[16px] leading-relaxed text-ink-400">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            data-reveal="up"
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
            className="rounded-xs border-t-2 border-ink-400/40 bg-paper-200/60 p-5 sm:p-7"
          >
            <h3 className="font-display text-2xl text-ink-900">
              It isn’t for you if…
            </h3>
            <ul className="mt-6 space-y-4">
              {suitability.notForYou.map((item) => (
                <li key={item} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-px w-4 shrink-0 bg-ink-400/50"
                  />
                  <span className="text-[16px] leading-relaxed text-ink-400">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scope boundary — brief §3. Folded in here rather than given a
            band of its own: it belongs with qualification, and the page was
            far too long. */}
        <p
          data-reveal="up"
          className="mt-8 border-l-2 border-gold-600 pl-6 text-[15.5px] leading-relaxed text-ink-400"
        >
          <strong className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-900">
            {scopeBoundary.title}{" "}
          </strong>
          {scopeBoundary.body}
        </p>
      </Section>

      {/* ============================================================ */}
      {/* The four weeks                                                */}
      {/* ============================================================ */}
      <Section tone="paper" id="programme">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="How the founding programme works"
            title="Four weeks, in order."
            lede="Each week has one job. Nothing is bolted on to pad the runtime."
            className="flex-1"
          />
          {/* The full curriculum is a document, so hand over the document
              rather than sending the reader to another page to find it. */}
          <div className="shrink-0">
            <ButtonLink
              href={curriculumPdf.href}
              variant="gold"
              size="sm"
            >
              Download the curriculum
            </ButtonLink>
            <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.13em] text-ink-400">
              PDF · {curriculumPdf.pages} pages
            </p>
          </div>
        </div>

        <ol className="mt-7 space-y-px overflow-hidden rounded-xs bg-ink-700/10">
          {weeks
            .filter((w) => w.slug.startsWith("week"))
            .map((week, i) => (
              <li
                key={week.slug}
                data-reveal="up"
                style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                className="glare group grid gap-3 bg-paper-100 px-6 py-5 transition-all duration-300 hover:bg-paper-50 hover:pl-8 sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-8 sm:px-7 sm:py-6 lg:grid-cols-[150px_minmax(0,1fr)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold-700 sm:pt-2">
                  {week.label}
                </span>
                <div>
                  <h3 className="font-display text-2xl leading-tight text-ink-900 sm:text-[1.75rem]">
                    {week.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-400">
                    {week.outcome}
                  </p>
                </div>
              </li>
            ))}
        </ol>

        {/* Founding Cohort Pricing Highlight ------------------------- */}
        <div
          data-reveal="up"
          className="mt-10 rounded-xs border border-ink-700/12 bg-paper-50 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-700">
                Founding Cohort Limited to 15 Places
              </span>
              <h3 className="mt-1.5 font-display text-2xl text-ink-900">
                First Five Founder Places from USD 550
              </h3>
              <p className="mt-1 text-[15px] text-ink-400">
                USD 550 for the first 5 places, then USD 695 for the remaining 10. Future regular cohort price: USD 995.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="/course#enrol" variant="primary">
                View Pricing &amp; Places
              </ButtonLink>
              <ButtonLink href="/diagnostic" variant="ghost">
                Take Diagnostic First
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* Carl                                                          */}
      {/* ============================================================ */}
      <Section tone="ink" id="carl">
        <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-14">
          <div
            data-reveal="scale"
            className="mx-auto w-full max-w-[300px] lg:mx-0 lg:max-w-none"
          >
            <Portrait size="compact" />
          </div>

          <div
            data-reveal="up"
            style={{ "--reveal-delay": "120ms" } as React.CSSProperties}
          >
            <Eyebrow tone="cream" className="mb-6">
              Who teaches it
            </Eyebrow>
            <h2 className="font-display text-4xl leading-[1.12] tracking-[-0.02em] text-paper-100 sm:text-5xl">
              {carl.name}
            </h2>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-500">
              {carl.credentials}
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-paper-300/65">
              {carl.role}
            </p>

            <blockquote className="mt-8 border-l-2 border-gold-500 pl-6">
              <p className="font-display text-2xl leading-[1.35] text-paper-100 sm:text-[1.8rem]">
                Owners don’t need to become accountants. They need{" "}
                <Mark tone="dark" display>
                  a forecast they trust enough to decide from
                </Mark>
                .
              </p>
            </blockquote>

            <p className="mt-7 max-w-xl text-[16px] leading-relaxed text-paper-300/70">
              {carl.bio[1]}
            </p>

            <ButtonLink href="/about" variant="onDark" size="sm" className="mt-8">
              More about Carl
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* Lead magnet                                                   */}
      {/* ============================================================ */}
      <Section tone="sand" id="diagnostic">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div data-reveal="up">
            <SectionHeading
              eyebrow="Free, no payment needed"
              title="Start with the Cash Visibility Diagnostic."
              lede="Ten questions about how your business handles money. It takes about four minutes and tells you which of the four weeks matters most for you."
            />
            <ButtonLink href="/diagnostic" variant="gold" className="mt-7">
              Take the diagnostic
            </ButtonLink>
          </div>

          <ul
            data-reveal="up"
            style={{ "--reveal-delay": "100ms" } as React.CSSProperties}
            className="divide-y divide-ink-700/10 rounded-xs border border-ink-700/12 bg-paper-50"
          >
            {[
              "Do you know your current cash position without asking anyone?",
              "Can you name your slowest-paying customer from memory?",
              "Do you know what you owe suppliers in the next 30 days?",
              "Could you survive a customer paying 45 days late?",
            ].map((q, i) => (
              <li key={q} className="flex gap-4 px-5 py-4">
                <span className="font-mono text-[11px] tracking-[0.15em] text-gold-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[15.5px] leading-relaxed text-ink-800">
                  {q}
                </span>
              </li>
            ))}
            <li className="px-5 py-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-400">
                …and six more
              </span>
            </li>
          </ul>
        </div>
      </Section>


      {/* ============================================================ */}
      {/* FAQ preview                                                   */}
      {/* ============================================================ */}
      <Section tone="sand" width="narrow">
        <SectionHeading
          eyebrow="Common questions"
          title="Before you ask."
          align="center"
        />
        <div className="mt-12 divide-y divide-ink-700/12 border-y border-ink-700/12">
          {faqs.slice(0, 4).map((faq) => (
            <details key={faq.q} className="group py-5" data-reveal="up">
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
              <p className="mt-4 max-w-2xl pr-10 text-[16px] leading-relaxed text-ink-400">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/faq" variant="ghost" size="sm">
            All questions
          </ButtonLink>
        </div>
      </Section>

      <ContactBand />

    </>
  );
}
