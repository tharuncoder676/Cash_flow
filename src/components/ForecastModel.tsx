"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Honeypot, useFillTimer } from "./FormGuard";
import Odometer from "./Odometer";
import { formatAED } from "@/lib/pricing";

/* ------------------------------------------------------------------ */
/* The model                                                           */
/* ------------------------------------------------------------------ */

const WEEKS = 13;
const WEEKS_PER_MONTH = 4.333;

type Inputs = {
  /** Monthly sales, in AED. */
  monthlySales: number;
  /** Cash in the bank the week the forecast starts. */
  openingCash: number;
  /** Days customers take to pay. */
  collectionDays: number;
  /** Days taken to pay suppliers. */
  supplierDays: number;
};

const DEFAULTS: Inputs = {
  monthlySales: 420_000,
  openingCash: 60_000,
  collectionDays: 60,
  supplierDays: 30,
};

const DIRECT_COST_RATE = 0.62;
/* Fixed cost is held as a SHARE of sales rather than an absolute figure.
   Once monthly sales became an input, a hard AED 138k of overhead turned a
   small business into a catastrophic loss-maker the moment you dragged
   revenue down — which would have been a modelling artefact, not a lesson.
   At 0.3286 the business clears roughly 5% net at every revenue, so the
   premise holds: it is profitable the whole way through. */
const FIXED_COST_RATE = 138_000 / 420_000;

/**
 * Materials and work-in-progress sit for this long before the sale they
 * serve, so cash leaves ahead of the revenue that funds it.
 */
const STOCK_DAYS = 40;

/** UAE VAT, paid quarterly — the week it lands is the week most owners feel. */
const VAT_RATE = 0.05;
const VAT_WEEK = 9;

/* Growth is held fixed rather than exposed. Four controls is already a lot
   for a hero, and of the five candidates this is the one an owner is least
   likely to know precisely — and the least "theirs". It is disclosed in the
   footnote instead. */
const GROWTH = 3;

export type ForecastPoint = {
  week: number;
  receipts: number;
  outflows: number;
  closing: number;
  /**
   * Opening cash plus profit earned to date, on an accrual basis: what the
   * bank balance WOULD read if every invoice were paid the moment it was
   * raised. Plotted against `closing`, the gap between the two is the whole
   * subject of the course — the headline says "profitable on paper, tight
   * on cash", and until this existed the chart only drew the second half.
   */
  earned: number;
  /** Set on the week the quarterly VAT payment falls due. */
  note?: string;
};

/**
 * A deliberately simple weekly cash model: sales grow, customers pay late,
 * suppliers and payroll do not wait. It is the shape of the problem the
 * course teaches, not a substitute for a real forecast — the UI says so.
 *
 * The business is profitable throughout. Gross margin is 38% on AED 420k of
 * monthly sales, against AED 138k of fixed cost — roughly AED 22k of monthly
 * profit. Every cash problem the chart shows is a timing problem.
 */
export function runForecast({
  monthlySales,
  openingCash,
  collectionDays,
  supplierDays,
}: Inputs): ForecastPoint[] {
  const baseWeeklySales = monthlySales / WEEKS_PER_MONTH;
  const weeklyGrowth = (1 + GROWTH / 100) ** (1 / WEEKS_PER_MONTH);

  // Sales for any week, including negative weeks — the trading history that
  // produces receipts inside the forecast window.
  const salesAt = (week: number) => baseWeeklySales * weeklyGrowth ** week;

  const collectionLag = collectionDays / 7;
  // Materials are paid (STOCK_DAYS - supplierDays) before the sale they serve.
  // When suppliers are paid faster than stock turns, this goes negative and
  // cash leaves the business ahead of the revenue it funds.
  const supplierLead = (STOCK_DAYS - supplierDays) / 7;
  const weeklyFixed = (monthlySales * FIXED_COST_RATE) / WEEKS_PER_MONTH;
  const quarterlyVat = monthlySales * 3 * VAT_RATE;

  const points: ForecastPoint[] = [];
  let closing = openingCash;
  let earned = openingCash;

  for (let week = 1; week <= WEEKS; week++) {
    /* ---- Cash: when the money actually moves ---- */
    const receipts = salesAt(week - collectionLag);
    const supplierPayments = salesAt(week + supplierLead) * DIRECT_COST_RATE;
    const vat = week === VAT_WEEK ? quarterlyVat : 0;
    const outflows = supplierPayments + weeklyFixed + vat;
    closing = closing + receipts - outflows;

    /* ---- Profit: when the work is done, regardless of who has paid ----
       VAT is deliberately excluded. It is collected on the government's
       behalf and was never profit, so charging it here would flatter the
       cash line's case by widening the gap with money that was never the
       owner's to begin with. */
    const revenue = salesAt(week);
    earned += revenue * (1 - DIRECT_COST_RATE) - weeklyFixed;

    points.push({
      week,
      receipts,
      outflows,
      closing,
      earned,
      note: vat > 0 ? "Quarterly VAT" : undefined,
    });
  }

  return points;
}

/* ------------------------------------------------------------------ */
/* Chart geometry                                                      */
/* ------------------------------------------------------------------ */

type Geometry = {
  W: number;
  H: number;
  PAD: { top: number; right: number; bottom: number; left: number };
};

const WIDE: Geometry = {
  W: 760,
  H: 264,
  PAD: { top: 22, right: 20, bottom: 34, left: 62 },
};

const NARROW: Geometry = {
  W: 360,
  H: 260,
  PAD: { top: 20, right: 12, bottom: 30, left: 42 },
};

/** Catmull-Rom through the points, emitted as cubic beziers. */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

function compactAED(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1000) return `${sign}${Math.round(abs / 1000)}k`;
  return `${sign}${Math.round(abs)}`;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ForecastModel() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const gradId = useId();
  const clipId = useId();
  const glowId = useId();

  /**
   * The line draws itself once, on first paint. After that the chart
   * responds instantly to the sliders — an intro animation replaying on
   * every drag would fight the interaction rather than support it.
   */
  const figureRef = useRef<HTMLElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Every path schedules the state change rather than setting it inline —
    // a synchronous setState here would cascade an extra render.
    let timer = 0;
    const start = (delay: number) => {
      timer = window.setTimeout(() => setDrawn(true), delay);
    };

    if (reduced) {
      start(0);
      return () => window.clearTimeout(timer);
    }

    const node = figureRef.current;
    if (!node) return;

    if (node.getBoundingClientRect().top < window.innerHeight) {
      start(180);
      return () => window.clearTimeout(timer);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        start(0);
        io.disconnect();
      },
      { threshold: 0.25 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // Phone-sized viewBox below 640px, so the chart's own type stays readable.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setNarrow(mq.matches);
    const id = requestAnimationFrame(apply);
    mq.addEventListener("change", apply);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", apply);
    };
  }, []);

  const G = narrow ? NARROW : WIDE;
  const { W, H, PAD } = G;
  const PLOT_W = W - PAD.left - PAD.right;
  const PLOT_H = H - PAD.top - PAD.bottom;

  const { points, low, geometry } = useMemo(() => {
    const points = runForecast(inputs);

    const low = points.reduce((a, b) => (b.closing < a.closing ? b : a));
    // The domain has to hold both lines now: profit climbs well above the
    // cash line, and the whole point is to see how far apart they get.
    const max = Math.max(
      ...points.map((p) => Math.max(p.closing, p.earned)),
      inputs.openingCash,
    );
    const min = Math.min(...points.map((p) => p.closing), 0);

    // Pad the domain so the line never touches the frame.
    const span = Math.max(max - min, 1);
    const top = max + span * 0.14;
    const bottom = min - span * 0.14;

    const x = (week: number) =>
      PAD.left + ((week - 1) / (WEEKS - 1)) * PLOT_W;
    const y = (value: number) =>
      PAD.top + ((top - value) / (top - bottom)) * PLOT_H;

    const coords = points.map((p) => ({ x: x(p.week), y: y(p.closing) }));
    const line = smoothPath(coords);
    const earnedLine = smoothPath(
      points.map((p) => ({ x: x(p.week), y: y(p.earned) })),
    );
    const area = `${line} L ${PAD.left + PLOT_W} ${y(bottom)} L ${PAD.left} ${y(bottom)} Z`;
    // The region *above* the curve. Intersected with the below-zero band it
    // yields exactly the deficit — so the red tint only appears where the
    // business is genuinely overdrawn, not across the whole floor.
    const aboveArea = `${line} L ${PAD.left + PLOT_W} ${PAD.top} L ${PAD.left} ${PAD.top} Z`;

    return {
      points,
      low,
      geometry: {
        x,
        y,
        coords,
        line,
        earnedLine,
        area,
        aboveArea,
        zeroY: y(0),
        bottomY: y(bottom),
      },
    };
  }, [inputs, PAD, PLOT_W, PLOT_H]);

  const goesNegative = low.closing < 0;

  /* What the two timing sliders are worth, in cash. Sales and opening cash
     are held at whatever the visitor entered, and only the payment terms are
     reset to where the model started — so the difference is the value of
     changing WHEN money moves, not how much of it there is. */
  const baselineLow = useMemo(() => {
    const pts = runForecast({
      ...inputs,
      collectionDays: DEFAULTS.collectionDays,
      supplierDays: DEFAULTS.supplierDays,
    });
    return pts.reduce((a, b) => (b.closing < a.closing ? b : a)).closing;
  }, [inputs]);
  const timingShift = Math.round(low.closing - baselineLow);
  const termsChanged: string[] = [];
  if (inputs.collectionDays !== DEFAULTS.collectionDays) {
    termsChanged.push(
      `customers paying in ${inputs.collectionDays} days instead of ${DEFAULTS.collectionDays}`,
    );
  }
  if (inputs.supplierDays !== DEFAULTS.supplierDays) {
    termsChanged.push(
      `paying suppliers in ${inputs.supplierDays} days instead of ${DEFAULTS.supplierDays}`,
    );
  }
  const joined = termsChanged.join(" and ");
  // Capitalised in code, not with ::first-letter — that needs an inline-block
  // box, which would stop the sentence wrapping naturally around the figure.
  const termsLead = joined.charAt(0).toUpperCase() + joined.slice(1);
  const showShift = termsChanged.length > 0 && Math.abs(timingShift) >= 500;
  const set = (key: keyof Inputs) => (value: number) => {
    if (!touched) setTouched(true);
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  // Transitions are on only while the user is driving the sliders; during
  // the intro the draw animation owns the line.
  const liveTransition = drawn && touched;

  return (
    <figure
      ref={figureRef}
      className="group relative overflow-hidden rounded-xs border border-paper-100/10 bg-ink-900 shadow-[0_30px_80px_-40px_rgba(5,14,36,0.9)] transition-shadow duration-700 hover:shadow-[0_36px_90px_-38px_rgba(5,14,36,1)]"
    >
      {/* Header ------------------------------------------------------ */}
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-paper-100/10 px-5 py-3.5 sm:px-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-500">
            13-week cash forecast
          </p>
          <p className="mt-1.5 font-display text-lg text-paper-100">
            Profitable on paper. Tight on cash.
          </p>
          {/* A legend rather than end-of-line labels: the right padding is
              20px, and a label there collides with the week-13 point. */}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em]">
            <span className="flex items-center gap-2 text-paper-300/75">
              <svg width="18" height="4" aria-hidden="true">
                <line x1="0" y1="2" x2="18" y2="2" stroke="#fbf8f1" strokeOpacity="0.7" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
              Profit earned
            </span>
            <span className="flex items-center gap-2 text-gold-400">
              <svg width="18" height="4" aria-hidden="true">
                <line x1="0" y1="2" x2="18" y2="2" stroke="#e8bc6c" strokeWidth="2.5" />
              </svg>
              Cash in the bank
            </span>
          </div>
        </div>
        <p
          className="tabular font-mono text-[10.5px] leading-relaxed text-paper-300/65 sm:text-right sm:text-[11px]"
          aria-hidden="true"
        >
          Opening {compactAED(inputs.openingCash)}
          <span className="sm:hidden"> · </span>
          <br className="hidden sm:inline" />
          Sales {compactAED(inputs.monthlySales)}/mo
        </p>
      </figcaption>

      {/* Chart ------------------------------------------------------- */}
      <div className="px-1.5 pt-3 sm:px-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Line chart of closing cash across thirteen weeks. The low point is week ${low.week} at ${formatAED(Math.round(low.closing))}.`}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d4a24c" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#d4a24c" stopOpacity="0" />
            </linearGradient>
            {/* Everything below the zero line, for the deficit tint. */}
            <filter id={glowId} x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id={clipId}>
              <rect
                x={PAD.left}
                y={geometry.zeroY}
                width={PLOT_W}
                height={Math.max(geometry.bottomY - geometry.zeroY, 0)}
              />
            </clipPath>
          </defs>

          {/* Week gridlines — faint, every other week */}
          {points
            .filter((p) => p.week % 2 === 1)
            .map((p) => (
              <line
                key={`grid-${p.week}`}
                x1={geometry.x(p.week)}
                x2={geometry.x(p.week)}
                y1={PAD.top}
                y2={PAD.top + PLOT_H}
                stroke="#fbf8f1"
                strokeOpacity="0.05"
              />
            ))}

          {/* Area under the curve */}
          <path
            d={geometry.area}
            fill={`url(#${gradId})`}
            style={{
              opacity: drawn ? 1 : 0,
              transition: liveTransition
                ? "none"
                : "opacity 0.7s 0.75s var(--ease-out-soft)",
            }}
          />
          {/* Deficit only — below zero and above the curve */}
          <path
            d={geometry.aboveArea}
            fill="#b4472f"
            fillOpacity="0.34"
            clipPath={`url(#${clipId})`}
            style={{
              opacity: drawn ? 1 : 0,
              transition: liveTransition
                ? "none"
                : "opacity 0.7s 0.85s var(--ease-out-soft)",
            }}
          />

          {/* Zero line — the one that matters */}
          <line
            x1={PAD.left}
            x2={PAD.left + PLOT_W}
            y1={geometry.zeroY}
            y2={geometry.zeroY}
            stroke={goesNegative ? "#b4472f" : "#fbf8f1"}
            strokeOpacity={goesNegative ? 0.9 : 0.25}
            strokeDasharray="3 4"
          />
          <text
            x={PAD.left - 10}
            y={geometry.zeroY + 4}
            textAnchor="end"
            className="font-mono"
            fontSize="10"
            fill={goesNegative ? "#b4472f" : "#fbf8f1"}
            fillOpacity={goesNegative ? 1 : 0.45}
          >
            0
          </text>

          {/* Opening-cash reference */}
          <text
            x={PAD.left - 10}
            y={geometry.y(inputs.openingCash) + 4}
            textAnchor="end"
            className="font-mono"
            fontSize="10"
            fill="#fbf8f1"
            fillOpacity="0.4"
          >
            {compactAED(inputs.openingCash)}
          </text>

          {/* Profit earned — dashed, because it is the "on paper" figure:
              money the business has made but not yet collected. Drawn under
              the cash line so cash stays the protagonist. */}
          <path
            d={geometry.earnedLine}
            fill="none"
            stroke="#fbf8f1"
            strokeOpacity="0.62"
            strokeWidth="1.6"
            strokeDasharray="5 4"
            strokeLinecap="round"
            style={{
              opacity: drawn ? 1 : 0,
              transition: liveTransition
                ? "none"
                : "opacity 0.9s 0.5s var(--ease-out-soft)",
            }}
          />

          {/* The line — draws left to right on first view */}
          <path
            d={geometry.line}
            fill="none"
            stroke="#e8bc6c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${glowId})`}
            style={{
              // 2200 comfortably exceeds the path length at this viewBox.
              strokeDasharray: 2200,
              strokeDashoffset: drawn ? 0 : 2200,
              transition: liveTransition
                ? "none"
                : "stroke-dashoffset 1.5s var(--ease-out-expo)",
            }}
          />

          {/* The quarterly VAT payment — labelled, because an unexplained
              cliff teaches nothing. */}
          <line
            x1={geometry.x(VAT_WEEK)}
            x2={geometry.x(VAT_WEEK)}
            y1={PAD.top}
            y2={PAD.top + PLOT_H}
            stroke="#fbf8f1"
            strokeOpacity="0.18"
            style={{
              transform: drawn ? "scaleY(1)" : "scaleY(0)",
              transformOrigin: "center top",
              transition: liveTransition
                ? "none"
                : "transform 0.6s 1.0s var(--ease-out-expo)",
            }}
          />
          <text
            x={geometry.x(VAT_WEEK) - 8}
            y={PAD.top + 11}
            textAnchor="end"
            className="font-mono"
            fontSize="9.5"
            fill="#fbf8f1"
            fillOpacity="0.5"
            style={{
              opacity: drawn ? 1 : 0,
              transition: liveTransition
                ? "none"
                : "opacity 0.5s 1.2s var(--ease-out-soft)",
            }}
          >
            QUARTERLY VAT
          </text>

          {/* The gap — from cash up to profit, in the worst week. This single
              measurement is what the course is about. */}
          <line
            x1={geometry.x(low.week)}
            x2={geometry.x(low.week)}
            y1={geometry.y(low.earned)}
            y2={geometry.y(low.closing)}
            stroke="#fbf8f1"
            strokeOpacity="0.55"
            strokeWidth="1"
            style={{
              opacity: drawn ? 1 : 0,
              transition: liveTransition
                ? "none"
                : "opacity 0.5s 1.5s var(--ease-out-soft)",
            }}
          />
          <circle
            cx={geometry.x(low.week)}
            cy={geometry.y(low.earned)}
            r="3.5"
            fill="#050e24"
            stroke="#fbf8f1"
            strokeOpacity="0.8"
            strokeWidth="1.5"
            style={{ opacity: drawn ? 1 : 0, transition: liveTransition ? "none" : "opacity 0.5s 1.5s var(--ease-out-soft)" }}
          />
          <text
            x={geometry.x(low.week) + 9}
            y={(geometry.y(low.earned) + geometry.y(low.closing)) / 2 + 4}
            className="font-mono"
            // The one number the chart exists to show. The viewBox is scaled
            // down to fit the card, so 10.5 rendered at ~8.6px — smaller than
            // the axis ticks it should outrank.
            fontSize={narrow ? "11" : "13.5"}
            fontWeight="700"
            fill="#fbf8f1"
            style={{ opacity: drawn ? 1 : 0, transition: liveTransition ? "none" : "opacity 0.5s 1.6s var(--ease-out-soft)" }}
          >
            AED {compactAED(low.earned - low.closing)} gap
          </text>

          {/* Low-point marker */}
          <line
            x1={geometry.x(low.week)}
            x2={geometry.x(low.week)}
            y1={geometry.y(low.closing)}
            y2={PAD.top + PLOT_H}
            stroke={goesNegative ? "#b4472f" : "#e8bc6c"}
            strokeOpacity="0.5"
            strokeDasharray="2 3"
          />
          <circle
            cx={geometry.x(low.week)}
            cy={geometry.y(low.closing)}
            r="5.5"
            fill="#050e24"
            stroke={goesNegative ? "#b4472f" : "#e8bc6c"}
            strokeWidth="2.5"
            style={{
              opacity: drawn ? 1 : 0,
              transformBox: "fill-box",
              transformOrigin: "center",
              transform: drawn ? "scale(1)" : "scale(0.2)",
              transition: liveTransition
                ? "none"
                : "opacity 0.4s 1.35s var(--ease-out-soft), transform 0.55s 1.35s var(--ease-spring)",
            }}
          />

          {/* Week axis */}
          {points
            .filter((p) => p.week % 2 === 1)
            .map((p) => (
              <text
                key={`wk-${p.week}`}
                x={geometry.x(p.week)}
                y={H - 14}
                textAnchor="middle"
                className="font-mono"
                fontSize="10"
                fill="#fbf8f1"
                fillOpacity={p.week === low.week ? 0.95 : 0.4}
              >
                {p.week}
              </text>
            ))}
          <text
            x={PAD.left - 10}
            y={H - 14}
            textAnchor="end"
            className="font-mono"
            fontSize="9"
            fill="#fbf8f1"
            fillOpacity="0.3"
          >
            WK
          </text>
        </svg>
      </div>

      {/* Readout ----------------------------------------------------- */}
      <div
        className="mx-5 mb-3.5 mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-t border-paper-100/10 pt-3.5 sm:mx-7 sm:mb-4 sm:pt-4"
        aria-live="polite"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-paper-300/65">
          Low point
        </span>
        <span className="font-display text-2xl text-paper-100">
          Week {low.week}
        </span>
        <span
          className={`tabular font-display text-2xl ${goesNegative ? "text-signal-low" : "text-gold-400"}`}
        >
          {formatAED(Math.round(low.closing))}
        </span>
        <span className="w-full text-[13px] leading-[1.5] text-paper-300/65 sm:w-auto sm:flex-1 sm:pl-2 sm:text-sm">
          {goesNegative
            ? `${compactAED(low.earned - inputs.openingCash)} of profit earned by then, and still overdrawn. Not a sales problem — all timing, and visible weeks out.`
            : `Cash holds — but it sits ${compactAED(low.earned - low.closing)} below the profit you have earned. Move the sliders to see how little it takes to go negative.`}
        </span>

        {/* Motion that is about their money: the cash the timing change is
            worth rolls in, digit by digit, and re-rolls as they keep dragging. */}
        {showShift && (
          <p className="mt-2 w-full border-t border-paper-100/10 pt-2.5 text-[13.5px] leading-[1.5] text-paper-100 sm:text-sm">
            {termsLead}{" "}
            {timingShift > 0 ? "frees" : "ties up"}{" "}
            <Odometer
              value={formatAED(Math.abs(timingShift))}
              className={`tabular font-display text-lg ${timingShift > 0 ? "text-gold-400" : "text-signal-low"}`}
            />{" "}
            at your lowest point.
          </p>
        )}
      </div>

      {/* Controls ---------------------------------------------------- */}
      <div className="grid gap-x-7 gap-y-1 border-t border-paper-100/10 bg-ink-800/60 px-5 py-3 sm:grid-cols-2 sm:gap-y-4 sm:py-4 sm:px-7">
        <Slider
          label="Customers pay in"
          value={inputs.collectionDays}
          onChange={set("collectionDays")}
          min={15}
          max={120}
          step={5}
          format={(v) => `${v} days`}
        />
        <Slider
          label="You pay suppliers in"
          value={inputs.supplierDays}
          onChange={set("supplierDays")}
          // 5, not 7: with a step of 5 the scale must pass through the
          // starting value of 30, or a visitor who touches this slider can
          // never get back to it and the "frees AED…" line never clears.
          min={5}
          max={90}
          step={5}
          format={(v) => `${v} days`}
        />
        <Slider
          label="Your monthly sales"
          value={inputs.monthlySales}
          onChange={set("monthlySales")}
          min={50_000}
          max={2_000_000}
          step={10_000}
          format={(v) => compactAED(v)}
        />
        <Slider
          label="Cash in the bank today"
          value={inputs.openingCash}
          onChange={set("openingCash")}
          min={0}
          max={500_000}
          step={5_000}
          format={(v) => compactAED(v)}
        />
      </div>

      <ForecastCapture inputs={inputs} low={low} />

      <p className="border-t border-paper-100/10 px-5 py-3 text-[11.5px] leading-relaxed text-paper-300/60 sm:px-7">
        <span className="sm:hidden">
          A simplified illustration. Not financial advice.
        </span>
        <span className="hidden sm:inline">
          A simplified model: 62% direct costs, overheads at 33% of sales,
          3% monthly growth, 5% VAT paid in week 9. Not financial advice, and
          not a full forecast — the course teaches you to build that.
        </span>
      </p>
    </figure>
  );
}

/* ------------------------------------------------------------------ */

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 pb-1">
        <label
          htmlFor={id}
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper-300/60"
        >
          {label}
        </label>
        <span className="tabular font-mono text-xs text-gold-400">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input -my-3"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

/**
 * "Email me this forecast".
 *
 * Collapsed to a single link until asked for, so the hero stays a chart and
 * not a form. The lead is stored WITH the figures the visitor entered and the
 * gap they produced — that context is the reason this is worth more than the
 * generic diagnostic sign-up.
 */
function ForecastCapture({
  inputs,
  low,
}: {
  inputs: Inputs;
  low: ForecastPoint;
}) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState("");
  const emailId = useId();
  const consentId = useId();
  // The form is revealed on demand, so the clock starts when it opens.
  const { elapsed, restart } = useFillTimer();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "forecast",
          website: data.get("website"),
          elapsedMs: elapsed(),
          email,
          marketingConsent: data.get("consent") === "on",
          context: {
            ...inputs,
            lowWeek: low.week,
            lowCash: Math.round(low.closing),
            profitEarnedByLow: Math.round(low.earned - inputs.openingCash),
            gap: Math.round(low.earned - low.closing),
          },
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Something went wrong.");
      }
      setSentTo(email);
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <p
        role="status"
        className="border-t border-paper-100/10 px-5 py-3.5 text-[13px] leading-relaxed text-paper-100 sm:px-7"
      >
        <span className="text-gold-400">Saved.</span> We&rsquo;ll email this
        forecast — week {low.week}, {formatAED(Math.round(low.closing))} — to{" "}
        {sentTo}.
      </p>
    );
  }

  if (!open) {
    return (
      <div className="border-t border-paper-100/10 px-5 py-3 sm:px-7">
        <button
          type="button"
          onClick={() => {
            restart();
            setOpen(true);
          }}
          className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-gold-400 underline decoration-gold-400/40 underline-offset-4 transition-colors hover:text-gold-200 hover:decoration-gold-200"
        >
          Email me this forecast →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative border-t border-paper-100/10 px-5 py-3.5 sm:px-7"
    >
      <Honeypot />
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor={emailId}
            className="block font-mono text-[10px] uppercase tracking-[0.16em] text-paper-300/70"
          >
            Your email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            className="mt-1.5 w-full rounded-xs border border-paper-100/20 bg-ink-900/60 px-3.5 py-2.5 text-[14px] text-paper-100 placeholder:text-paper-300/40 focus:border-gold-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-xs bg-gold-500 px-5 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-700 transition-colors hover:bg-gold-400 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send it"}
        </button>
      </div>
      {/* Consent is its own box and never pre-ticked — brief §8. Sending the
          forecast itself does not depend on it. */}
      <label htmlFor={consentId} className="mt-2.5 flex cursor-pointer items-start gap-2.5">
        <input
          id={consentId}
          name="consent"
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
        />
        <span className="text-[12px] leading-relaxed text-paper-300/70">
          Also send occasional cash-flow guidance and founding-cohort news.
          Unsubscribe any time.
        </span>
      </label>
      {state === "error" && error && (
        <p role="alert" className="mt-2 text-[13px] text-signal-low">
          {error}
        </p>
      )}
    </form>
  );
}
