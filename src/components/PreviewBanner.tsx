import { isPreview } from "@/lib/env";
import { cohort, pricing } from "@/content/course";

/**
 * Preview notice for client review builds.
 *
 * Carl will be looking at a site that says "AED 2,000" with a real-looking
 * checkout. He needs to know at a glance that it is not live, that no card
 * will be charged, and that the dates and policies he can see are
 * placeholders awaiting his own input — otherwise the first review comment
 * is always "the dates are wrong".
 *
 * Disappears automatically at go-live: it is tied to the same flag that
 * opens the site to search engines.
 */
export default function PreviewBanner() {
  if (!isPreview()) return null;

  return (
    <div className="relative z-[60] bg-ink-900 text-paper-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-6 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
        <p className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-gold-400">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-gold-400"
          />
          Preview for review — not live
        </p>
        <p className="text-[12.5px] leading-relaxed text-paper-300/75">
          No payment is taken. Cohort dates, VAT wording and all policies are
          placeholders awaiting your confirmation
          <span className="hidden sm:inline">
            {" "}
            ({pricing.cohortCapacity} places · {cohort.durationWeeks} weeks)
          </span>
          .
        </p>
      </div>
    </div>
  );
}
