"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One order, followed day by day as the reader scrolls.
 *
 * This replaces the static cash-cycle diagram with the same four bars, drawn to
 * the same scale, but told in sequence: a marker walks from day 0 to day 100
 * as the figure moves up the screen, each bar fills only once its stage has
 * begun, and the gap the owner funds stays red for as long as the invoice is
 * unpaid — turning gold only on the day the cash finally lands.
 *
 * It is driven by scroll POSITION, not by pinning the section in place, so
 * the page gets no taller and it behaves identically on a phone, where most
 * of the site's pointer-driven effects do not run at all.
 *
 * The server render, JavaScript-off, and reduced-motion states all show the
 * finished picture (day 100). Motion only ever starts from a complete figure.
 */

const STOCK_DAYS = 40;
const CUSTOMER_DAYS = 60;
const SUPPLIER_DAYS = 30;
const TOTAL = STOCK_DAYS + CUSTOMER_DAYS; // 100
const GAP = TOTAL - SUPPLIER_DAYS; // 70

/* Two drawings of the same figure. A single 760-wide drawing squeezed onto a
   phone rendered its labels at about 5px. The narrow one is drawn at roughly
   the size it is shown, with shorter labels that fit inside their bars and
   the per-bar day counts dropped where the walking marker already says it. */
type Geometry = {
  W: number;
  H: number;
  PAD_X: number;
  TOP: number;
  BAR_H: number;
  rows: [number, number, number, number];
  label: number;
  mono: number;
  marker: number;
  text: { stock: string; waiting: string; credit: string; funding: string; funded: string };
  counts: boolean;
};

const WIDE: Geometry = {
  W: 760,
  H: 300,
  PAD_X: 18,
  TOP: 44,
  BAR_H: 34,
  rows: [44, 90, 136, 188],
  label: 12.5,
  mono: 11,
  marker: 11,
  text: {
    stock: "Stock and work in progress",
    waiting: "Waiting for customers to pay",
    credit: "Supplier credit",
    funding: "You are funding this gap",
    funded: "You funded this gap",
  },
  counts: true,
};

const NARROW: Geometry = {
  W: 340,
  H: 256,
  PAD_X: 10,
  TOP: 40,
  BAR_H: 30,
  rows: [40, 78, 116, 158],
  label: 13,
  mono: 11,
  marker: 12,
  text: {
    stock: "Stock & work",
    waiting: "Waiting to be paid",
    credit: "Supplier",
    funding: "Funding this gap",
    funded: "Funded this gap",
  },
  counts: false,
};

const NAVY = "#0b1e45";
const SLATE = "#425073";
const GREEN = "#2f6d55";
const GOLD = "#d4a24c";
const GOLD_DEEP = "#7a5617";
const RED = "#b4472f";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

function beat(day: number): string {
  if (day <= 0)
    return "Day 0 — an order comes in. You buy the materials on supplier credit.";
  if (day < SUPPLIER_DAYS)
    return `Day ${day} — the goods are in and the supplier isn’t due yet. The cash is still in your bank.`;
  if (day < STOCK_DAYS)
    return `Day ${day} — the supplier is paid. The cash has gone, and nothing has come back.`;
  if (day < TOTAL)
    return `Day ${day} — the work is delivered and invoiced ${day - STOCK_DAYS} days ago. Still waiting to be paid.`;
  return `Day ${TOTAL} — paid at last. For ${GAP} of those days, your business funded the order itself.`;
}

export default function CashFlowStory() {
  const ref = useRef<HTMLElement>(null);
  const [day, setDay] = useState(TOTAL);
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

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      // Day 0 as the figure's top rises past 85% of the screen, day 100 by
      // the time it reaches 15% — about 70% of a screen of scrolling.
      const progress = clamp((vh * 0.85 - rect.top) / (vh * 0.7), 0, 1);
      setDay(Math.round(progress * TOTAL));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const G = narrow ? NARROW : WIDE;
  const { W, H, PAD_X, TOP, BAR_H, rows: ROW } = G;
  const x = (d: number) => PAD_X + (d / TOTAL) * (W - PAD_X * 2);

  const stock = clamp(day, 0, STOCK_DAYS);
  const waiting = clamp(day - STOCK_DAYS, 0, CUSTOMER_DAYS);
  const credit = clamp(day, 0, SUPPLIER_DAYS);
  const funded = clamp(day - SUPPLIER_DAYS, 0, GAP);
  const paid = day >= TOTAL;
  const gapColour = paid ? GOLD : RED;

  const show = (from: number) => ({
    opacity: day >= from ? 1 : 0,
    transition: "opacity 0.35s ease",
  });

  const markerX = x(day);
  const labelX = clamp(markerX, PAD_X + 26, W - PAD_X - 26);
  const mid = (row: number, h = BAR_H) => row + h / 2 + 4;

  return (
    <figure
      ref={ref}
      className="overflow-hidden rounded-xs border border-ink-700/12 bg-paper-50 p-5 sm:p-7"
    >
      <figcaption className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold-700">
          The operating cash cycle &middot; one order
        </p>
        <p className="mt-2 max-w-xl text-pretty text-[15px] leading-relaxed text-ink-400">
          Follow a single order as you scroll. Drawn to scale: you pay out on
          day {SUPPLIER_DAYS} and are paid on day {TOTAL}.
        </p>
      </figcaption>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Timeline over ${TOTAL} days. Stock and work in progress take ${STOCK_DAYS} days, customers then take a further ${CUSTOMER_DAYS} days to pay, while suppliers are paid on day ${SUPPLIER_DAYS}. The business funds a gap of ${GAP} days.`}
      >
        {/* Day scale */}
        {[0, 20, 40, 60, 80, 100].map((d) => (
          <g key={d}>
            <line x1={x(d)} x2={x(d)} y1={TOP - 6} y2={H - 44} stroke={NAVY} strokeOpacity="0.07" />
            {/* "DAY 0" sits on the very left edge: centred there, half of it
                fell outside the drawing and read "AY 0" on a phone. */}
            <text x={x(d)} y={H - 26} textAnchor={d === 0 ? "start" : "middle"} className="font-mono" fontSize={G.mono - 1} fill={SLATE} fillOpacity="0.75">
              {d === 0 ? "DAY 0" : d}
            </text>
          </g>
        ))}

        {/* Row 1 — stock and work in progress */}
        <rect x={x(0)} y={ROW[0]} width={x(STOCK_DAYS) - x(0)} height={BAR_H} rx={2} fill={NAVY} fillOpacity="0.04" />
        <rect x={x(0)} y={ROW[0]} width={x(stock) - x(0)} height={BAR_H} rx={2} fill={NAVY} fillOpacity="0.12" />
        <text x={x(0) + 12} y={mid(ROW[0])} fontSize={G.label} fill={NAVY} fontWeight="500">
          {G.text.stock}
        </text>
        {G.counts && (
          <text x={x(STOCK_DAYS) - 12} y={mid(ROW[0])} textAnchor="end" className="font-mono" fontSize={G.mono} fill={SLATE}>
            {stock}d
          </text>
        )}

        {/* Row 2 — waiting for the customer */}
        <rect x={x(STOCK_DAYS)} y={ROW[1]} width={x(TOTAL) - x(STOCK_DAYS)} height={BAR_H} rx={2} fill={NAVY} fillOpacity="0.04" />
        <rect x={x(STOCK_DAYS)} y={ROW[1]} width={x(STOCK_DAYS + waiting) - x(STOCK_DAYS)} height={BAR_H} rx={2} fill={NAVY} fillOpacity="0.12" />
        <g style={show(STOCK_DAYS)}>
          <text x={x(STOCK_DAYS) + 12} y={mid(ROW[1])} fontSize={G.label} fill={NAVY} fontWeight="500">
            {G.text.waiting}
          </text>
          <text x={x(TOTAL) - 12} y={mid(ROW[1])} textAnchor="end" className="font-mono" fontSize={G.mono} fill={SLATE}>
            {waiting}d
          </text>
        </g>

        {/* Row 3 — supplier credit: cash still in hand */}
        <rect x={x(0)} y={ROW[2]} width={x(SUPPLIER_DAYS) - x(0)} height={BAR_H} rx={2} fill={GREEN} fillOpacity="0.05" />
        <rect x={x(0)} y={ROW[2]} width={x(credit) - x(0)} height={BAR_H} rx={2} fill={GREEN} fillOpacity="0.16" />
        <text x={x(0) + 12} y={mid(ROW[2])} fontSize={G.label} fill={GREEN} fontWeight="500">
          {G.text.credit}
        </text>
        {G.counts && (
          <text x={x(SUPPLIER_DAYS) - 12} y={mid(ROW[2])} textAnchor="end" className="font-mono" fontSize={G.mono} fill={GREEN}>
            {credit}d
          </text>
        )}

        {/* Row 4 — the gap the owner funds */}
        <rect x={x(SUPPLIER_DAYS)} y={ROW[3]} width={x(TOTAL) - x(SUPPLIER_DAYS)} height={BAR_H + 4} rx={2} fill={gapColour} fillOpacity="0.06" style={{ transition: "fill 0.5s ease" }} />
        <rect x={x(SUPPLIER_DAYS)} y={ROW[3]} width={x(SUPPLIER_DAYS + funded) - x(SUPPLIER_DAYS)} height={BAR_H + 4} rx={2} fill={gapColour} fillOpacity="0.24" style={{ transition: "fill 0.5s ease" }} />
        <g style={show(SUPPLIER_DAYS)}>
          <text x={x(SUPPLIER_DAYS) + 12} y={mid(ROW[3], BAR_H + 4)} fontSize={G.label + 0.5} fill={paid ? GOLD_DEEP : RED} fontWeight="600">
            {paid ? G.text.funded : G.text.funding}
          </text>
          <text x={x(TOTAL) - 12} y={mid(ROW[3], BAR_H + 4)} textAnchor="end" className="font-mono" fontSize={G.mono + 1} fill={paid ? GOLD_DEEP : RED} fontWeight="600">
            {funded} DAYS
          </text>
        </g>

        {/* Cash out / cash in markers */}
        <text x={x(SUPPLIER_DAYS)} y={H - 8} textAnchor="middle" className="font-mono" fontSize={G.mono - 1} fill={SLATE} style={show(SUPPLIER_DAYS)}>
          CASH OUT
        </text>
        <text x={x(TOTAL)} y={H - 8} textAnchor="end" className="font-mono" fontSize={G.mono - 1} fill={GOLD_DEEP} fontWeight="700" style={show(TOTAL)}>
          CASH IN
        </text>

        {/* The walking day marker */}
        <g aria-hidden="true" style={{ opacity: paid ? 0.35 : 1, transition: "opacity 0.5s ease" }}>
          <line x1={markerX} x2={markerX} y1={TOP - 12} y2={H - 44} stroke={NAVY} strokeWidth="1.5" />
          <circle cx={markerX} cy={TOP - 12} r="4" fill={NAVY} />
          <text x={labelX} y={TOP - 22} textAnchor="middle" className="font-mono" fontSize={G.marker} fontWeight="700" fill={NAVY}>
            DAY {day}
          </text>
        </g>
      </svg>

      {/* The narration. Visual only: a screen reader gets the complete
          summary in the figure's label, not a stream of per-day updates. */}
      <p
        aria-hidden="true"
        className={`mt-4 min-h-[3.3em] border-t border-ink-700/10 pt-4 text-[15px] leading-relaxed ${
          paid ? "text-gold-700" : "text-ink-800"
        }`}
      >
        {beat(day)}
      </p>

      <p className="mt-2 text-[15px] leading-relaxed text-ink-400">
        Shorten the gap and cash appears without a single extra sale. Week 2
        works out which of the three bars is yours to move first.
      </p>
    </figure>
  );
}
