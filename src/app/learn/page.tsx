import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/primitives";
import { site, weeks } from "@/content/course";

export const metadata: Metadata = {
  title: "Learner area",
  robots: { index: false, follow: false },
};

/**
 * Learner area — route reserved, shell only.
 *
 * Phase one sells the cohort; delivery is phase two (Supabase auth, lesson
 * player, progress, gated downloads). The route exists now so that enrolment
 * emails, the dashboard link and the sitemap do not have to change later.
 * See docs/PHASE-TWO.md.
 */
export default function LearnPage() {
  return (
    <div className="bg-paper-200">
      <Container width="default" className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-6">Course area</Eyebrow>
          <h1 className="font-display text-[2.4rem] leading-[1.12] tracking-[-0.025em] text-ink-900 sm:text-5xl">
            Opening before week one
          </h1>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-pretty text-ink-400">
            Your course area goes live ahead of the cohort start date. Everyone
            with a confirmed place gets login details by email — nothing to set
            up now.
          </p>
        </div>

        {/* What will be here ------------------------------------------- */}
        <div className="mx-auto mt-14 max-w-3xl">
          <ol className="divide-y divide-ink-700/12 overflow-hidden rounded-xs border border-ink-700/12 bg-paper-50">
            {weeks.map((week) => (
              <li
                key={week.slug}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-6 py-5 sm:px-8"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-700">
                    {week.label}
                  </p>
                  <p className="mt-1.5 font-display text-lg text-ink-900">
                    {week.title}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300">
                  {week.lessons.length} lesson
                  {week.lessons.length === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 text-center">
            <p className="text-[15px] leading-relaxed text-ink-400">
              Enrolled and expecting access?{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-gold-700 underline underline-offset-4"
              >
                {site.contactEmail}
              </a>
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/course">See the programme</ButtonLink>
              <ButtonLink href="/diagnostic" variant="ghost">
                Take the diagnostic
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
