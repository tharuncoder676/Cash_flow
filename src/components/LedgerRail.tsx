"use client";

import { useEffect, useState } from "react";

type RailSection = { id: string; label: string };

/**
 * The ledger rail.
 *
 * A ruled margin down the left of the page, the way an accountant's ledger
 * is ruled — each section a tick, the one you are reading extended and
 * named. It replaces a conventional scroll-progress bar with something that
 * belongs to this subject, and it earns its place by being navigable: these
 * are real links, in a real landmark, not decoration.
 *
 * Desktop only, in two stages. The ticks need only the 56px they occupy, so
 * they appear at xl. The named label is another ~130px of plate, and the
 * page content is capped at max-w-6xl (1152px) — so the free gutter is
 * (100vw - 1152) / 2, and the label only fits once that reaches ~190px,
 * i.e. about 1532px wide. Below 2xl it was printing straight over the
 * section it was naming. Ticks from xl, label from 2xl.
 */
export default function LedgerRail({
  sections,
}: {
  sections: RailSection[];
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  // The rail floats over whatever band is behind it, so it has to know
  // whether that band is dark — on navy the ink colours disappear entirely.
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));
    if (nodes.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // The rail appears once the hero is behind you.
      setVisible(window.scrollY > window.innerHeight * 0.6);

      // Active = the last section whose top has passed the reading line.
      const line = window.innerHeight * 0.4;
      let current = nodes[0].id;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= line) current = node.id;
      }
      setActive(current);

      // Sample the band behind the rail and flip the palette if it is dark.
      // Probed at x=6 — clear of the rail's own links, which would otherwise
      // be what elementFromPoint returns.
      const probe = document.elementFromPoint(6, window.innerHeight / 2);
      const band = probe?.closest<HTMLElement>(
        "section, footer, div[class*='bg-ink'], div[class*='bg-paper']",
      );
      if (band) {
        const bg = window.getComputedStyle(band).backgroundColor;
        const parts = bg.match(/[\d.]+/g);
        if (parts && parts.length >= 3) {
          const [r, g, b] = parts.map(Number);
          // Rec. 601 luma is plenty for a light/dark decision.
          setOnDark((r * 299 + g * 587 + b * 114) / 1000 < 128);
        }
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  const activeIndex = Math.max(
    sections.findIndex((s) => s.id === active),
    0,
  );

  return (
    <nav
      aria-label="Sections on this page"
      className={`pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 transition-opacity duration-700 xl:block ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <ul className="flex flex-col gap-0">
        {sections.map((section, i) => {
          const isActive = section.id === active;
          const isPast = i < activeIndex;
          return (
            <li key={section.id} className="group relative flex h-10 items-center">
              <a
                href={`#${section.id}`}
                tabIndex={visible ? 0 : -1}
                className="pointer-events-auto flex items-center gap-3 rounded-xs py-1 pr-2"
              >
                {/* The rule mark: a tick that extends when you reach it. */}
                <span
                  aria-hidden="true"
                  className={`block h-[1.5px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive
                      ? onDark
                        ? "w-8 bg-gold-400"
                        : "w-8 bg-gold-600"
                      : isPast
                        ? onDark
                          ? "w-4 bg-gold-400/60"
                          : "w-4 bg-gold-600/50"
                        : onDark
                          ? "w-3 bg-paper-100/35 group-hover:w-5 group-hover:bg-paper-100/70"
                          : "w-3 bg-ink-400/35 group-hover:w-5 group-hover:bg-ink-400/60"
                  }`}
                />
                {/* The label rides its own dark plate rather than taking its
                    colour from the band behind it. A fixed element floating
                    over alternating light and dark sections cannot depend on
                    a colour probe for legibility — if the probe is ever wrong
                    or late, the text would vanish. Cream on ink-900 is 18:1
                    everywhere, always. */}
                <span
                  className={`hidden whitespace-nowrap rounded-xs bg-ink-900/92 px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-paper-100 shadow-[0_6px_18px_-8px_rgba(5,14,36,0.7)] backdrop-blur-sm transition-all duration-500 2xl:block ${
                    isActive
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {section.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
