import type { Metadata } from "next";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Section,
  SectionHeading,
} from "@/components/primitives";
import Portrait from "@/components/Portrait";
import Mark from "@/components/Mark";
import { carl, site, scopeBoundary } from "@/content/course";

export const metadata: Metadata = {
  title: "About Carl Lewis",
  description:
    "Carl Lewis, MBA FCMA CGMA — fractional CFO to owner-led SMEs across the UAE and GCC, and the instructor behind Cash Flow Mastery.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero — portrait leads, because instructor trust is the whole
          job of this page. */}
      <section className="bg-paper-200 py-16 sm:py-24">
        <Container width="default">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-16">
            <div data-reveal="scale" className="mx-auto w-full max-w-[340px] lg:mx-0 lg:max-w-none">
              <Portrait priority />
            </div>

            <div data-reveal="up" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
              <Eyebrow className="mb-6">The instructor</Eyebrow>
              <h1 className="font-display text-[2.8rem] leading-[1.12] tracking-[-0.03em] text-ink-900 sm:text-5xl lg:text-[3.8rem]">
                {carl.name}
              </h1>
              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-gold-700">
                {carl.credentials}
              </p>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-400">
                {carl.role}
              </p>

              <blockquote className="mt-9 border-l-2 border-gold-600 pl-7">
                <p className="font-display text-[1.5rem] leading-[1.34] text-balance text-ink-900 sm:text-[1.85rem]">
                  Finance is the language of business. You don’t need to become
                  an accountant — but you should{" "}
                  <Mark display>understand what your business is telling you</Mark>.
                </p>
              </blockquote>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/course">See the founding cohort</ButtonLink>
                <ButtonLink href={carl.linkedin} variant="ghost">
                  LinkedIn
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="paper" width="narrow">
        <div className="space-y-6 text-[17px] leading-relaxed text-ink-400">
          {carl.bio.map((para) => (
            <p key={para.slice(0, 30)}>{para}</p>
          ))}
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-xs bg-ink-700/12 sm:grid-cols-3">
          {[
            ["MBA", "Master of Business Administration"],
            ["FCMA", "Fellow, Chartered Institute of Management Accountants"],
            ["CGMA", "Chartered Global Management Accountant"],
          ].map(([short, long]) => (
            <div key={short} className="bg-paper-50 p-7">
              <p className="font-display text-2xl text-ink-900">{short}</p>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-400">
                {long}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="ink" width="narrow">
        <SectionHeading
          eyebrow="Where this sits"
          tone="cream"
          title="Training, not a retainer."
        />
        <p className="mt-7 text-[17px] leading-relaxed text-paper-300/75">
          {scopeBoundary.body}
        </p>
        <p className="mt-6 text-[17px] leading-relaxed text-paper-300/75">
          Carl’s fractional CFO practice runs separately under{" "}
          <a
            href={site.parentBrand.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-500 underline underline-offset-4"
          >
            {site.parentBrand.name}
          </a>
          . If what you need is hands-on CFO work rather than learning to do it
          yourself, start there instead — it will be a better use of your money.
        </p>
        <ButtonLink
          href={site.parentBrand.url}
          variant="onDark"
          size="sm"
          className="mt-9"
        >
          Independent Advisors
        </ButtonLink>
      </Section>
    </>
  );
}
