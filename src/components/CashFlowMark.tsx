/**
 * PLACEHOLDER LOGO — Cash Flow Mastery.
 *
 * Stands in until the client supplies real brand assets (item A4 in
 * docs/OPEN-ITEMS.md). It is deliberately not a wordmark or a monogram,
 * because guessing at either would be inventing brand the client has not
 * approved. Instead it draws the one thing the programme is actually about:
 * a cash curve that dips and recovers — the same shape as the forecast in
 * the hero, at 24px.
 *
 * The curve draws itself once on mount, and again on hover of the lockup.
 * Swapping this file for the real mark is the whole migration.
 */
export default function CashFlowMark({
  className = "h-9 w-9",
}: {
  className?: string;
}) {
  return (
    <span className={`relative block shrink-0 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 36 36" className="h-full w-full">
        <rect width="36" height="36" rx="4" className="fill-ink-700" />

        {/* Baseline — the zero line, as on the forecast. */}
        <line
          x1="7"
          y1="23.5"
          x2="29"
          y2="23.5"
          stroke="currentColor"
          className="text-gold-500/30"
          strokeWidth="1"
          strokeDasharray="2 2.5"
        />

        {/* The curve: steady, a dip below the line, then recovery. */}
        <path
          d="M7 17.5 C 11 17, 12.5 18.5, 15 19 S 18 27, 21 26 S 26 19.5, 29 13.5"
          fill="none"
          stroke="currentColor"
          className="mark-curve text-gold-500"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
        />

        {/* The low point, the thing the course teaches you to see coming. */}
        <circle
          cx="21"
          cy="26"
          r="2.1"
          className="mark-dot fill-ink-700 stroke-gold-400"
          strokeWidth="1.6"
        />
      </svg>
    </span>
  );
}
