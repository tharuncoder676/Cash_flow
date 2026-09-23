"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that rolls into place, digit by digit, like a cash counter.
 *
 * Each digit is its own column of 0–9 that slides to rest, with a short
 * stagger left to right so the number settles rather than snapping. Used
 * only on money — the price, the forecast low point — where the metaphor
 * is literal and the movement means something.
 *
 * The final value is in the DOM from the start, so it is what a screen
 * reader announces and what shows with JavaScript off. The rolling columns
 * are decorative and hidden from assistive tech.
 */
export default function Odometer({
  value,
  prefix = "",
  className = "",
}: {
  /** Already-formatted figure, e.g. "2,000". Non-digits pass through. */
  value: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [rolled, setRolled] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = ref.current;
    if (!node) return;

    // Scheduled rather than set inline, so enabling the columns does not
    // cascade a second render inside the effect.
    let timer = 0;
    const enable = requestAnimationFrame(() => setEnabled(true));
    const start = () => {
      timer = window.setTimeout(() => setRolled(true), 160);
    };

    if (node.getBoundingClientRect().top < window.innerHeight) {
      start();
      return () => {
        cancelAnimationFrame(enable);
        window.clearTimeout(timer);
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        start();
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(enable);
      window.clearTimeout(timer);
    };
  }, []);

  const chars = value.split("");

  return (
    <span ref={ref} className={className}>
      {prefix && <span>{prefix}</span>}

      {/* The accessible, no-JS value. */}
      <span className={enabled ? "sr-only" : undefined}>{value}</span>

      {enabled && (
        // Every piece of the figure is exactly 1em tall, and the group is
        // aligned to the bottom of the text rather than its baseline. A
        // clipped (overflow-hidden) column has no text baseline of its own, so
        // the browser used its bottom edge instead, which lifted the digits
        // clear of the words around them like superscript.
        <span aria-hidden="true" className="inline-flex align-text-bottom">
          {chars.map((char, i) => {
            // Only 0–9 roll. `Number(char)` is not a digit test: it turns a
            // space — including the non-breaking space in "AED 13,639" — into
            // 0, which rendered a stray rolling "0" and ate the gap.
            const isDigit = char >= "0" && char <= "9";
            const digit = isDigit ? Number(char) : 0;
            if (!isDigit) {
              return (
                <span
                  key={`c-${i}`}
                  className="inline-block"
                  style={{ height: "1em", lineHeight: "1em" }}
                >
                  {char}
                </span>
              );
            }
            return (
              <span
                // Keyed by position, not by digit: when a live figure changes,
                // the column stays mounted and rolls to the new digit.
                key={`d-${i}`}
                className="inline-block overflow-hidden align-bottom"
                style={{ height: "1em", lineHeight: "1em" }}
              >
                <span
                  className="flex flex-col transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: `translateY(-${(rolled ? digit : 0) * 10}%)`,
                    transitionDelay: `${i * 70}ms`,
                  }}
                >
                  {Array.from({ length: 10 }, (_, n) => (
                    <span
                      key={n}
                      style={{ height: "1em", lineHeight: "1em" }}
                      className="block"
                    >
                      {n}
                    </span>
                  ))}
                </span>
              </span>
            );
          })}
        </span>
      )}
    </span>
  );
}
