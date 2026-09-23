"use client";

import Link from "next/link";
import type { EnrolCta } from "@/lib/pricing";
import { useEffect, useRef, useState } from "react";

/**
 * Sticky enrolment bar.
 *
 * The one pattern common to every premium course page: once the hero price
 * scrolls away, the price and the next step stay within reach.
 *
 * It is a statement of the current price and remaining places — no timer, no
 * "only 2 left!" — because the brief rules out manufactured urgency. It also
 * gets out of the way near the enrolment section and the footer, so the page
 * never shows two competing calls to action.
 */
export default function StickyEnrol({
  price,
  remaining,
  capacity,
  soldOut,
  cta,
}: {
  price: string;
  remaining: number;
  capacity: number;
  soldOut: boolean;
  /** Resolved on the server, so the bar can never promise payment that the
   *  enrolment page is not yet able to take. */
  cta: EnrolCta;
}) {
  const [visible, setVisible] = useState(false);
  const frame = useRef(0);

  useEffect(() => {
    // Appears once past this point, hides again over the enrol section so it
    // never competes with the real pricing block.
    const enrolSection = document.getElementById("enrol");
    const footer = document.querySelector("footer");

    const update = () => {
      frame.current = 0;
      const past = window.scrollY > window.innerHeight * 0.85;

      let overlapping = false;
      for (const node of [enrolSection, footer]) {
        if (!node) continue;
        const r = node.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) overlapping = true;
      }

      setVisible(past && !overlapping);
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      data-enrol-bar=""
      className={`fixed inset-x-0 bottom-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
      // Hidden from assistive tech while off-screen: the same links exist
      // in the page proper, so this would otherwise be a duplicate.
      aria-hidden={!visible}
    >
      {/* Graded blur behind the bar, so the page dissolves under it rather
          than being sliced by a hard edge. Rides the bar's own transition,
          so it is only composited while the bar is actually on screen. */}
      <div className="gradual-blur" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-4 pr-[5.5rem] sm:px-6 sm:pb-6 sm:pr-24">
        <div className="flex items-center justify-between gap-4 rounded-xs border border-paper-100/15 bg-ink-900/95 px-5 py-3.5 shadow-[0_20px_50px_-20px_rgba(5,14,36,0.8)] backdrop-blur-md sm:px-7 sm:py-4">
          <div className="min-w-0">
            <p className="truncate font-display text-[15px] leading-tight text-paper-100 sm:text-lg">
              {soldOut ? "This cohort is full" : "Founding cohort"}
            </p>
            <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.13em] text-paper-300/65">
              {soldOut
                ? "Waitlist open for the next one"
                : `${price} · ${remaining} of ${capacity} places left`}
            </p>
          </div>

          <Link
            href={cta.href}
            tabIndex={visible ? 0 : -1}
            className="btn-sheen inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xs bg-gold-500 px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-700 transition-colors duration-300 hover:bg-gold-400 sm:px-7"
          >
            {cta.shortLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
