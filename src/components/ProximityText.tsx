"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * Ink that bleeds toward the cursor.
 *
 * Fraunces is loaded as a true variable font with its SOFT and opsz axes live
 * (see layout.tsx), which almost no site bothers to ship. That lets us do
 * something an ordinary webfont physically cannot: as the pointer passes a
 * letter, that letter's shape changes — the optical size drops so the strokes
 * thicken and the contrast flattens, and the terminals round off underneath.
 * Nothing translates, nothing fades, nothing flashes. The letterform itself
 * softens, like ink spreading into paper where the eye is resting.
 *
 * ACCESSIBILITY CONTRACT: the split output is marked aria-hidden, because the
 * per-letter spans become inline-block on pointer devices and some screen
 * readers treat an inline-block as a word boundary — which would spell the
 * headline out letter by letter. The caller MUST therefore give the enclosing
 * heading its own accessible name (aria-label). Carrying a visually-hidden
 * duplicate here instead was the obvious alternative, but it put the sentence
 * into the DOM twice, so copying the headline or reading the <h1> yielded it
 * doubled.
 *
 * It is deliberately slow to arrive and slow to leave — the falloff is eased
 * and each letter lerps toward its target, so the headline breathes rather
 * than twitches. Pointer-only and reduced-motion aware: touch users and anyone
 * who asked for less movement get plain, static type.
 */

type Axes = { SOFT: number; opsz: number };

/* Resting state matches `.font-display` in globals.css, so an untouched
   headline is identical to every other display heading on the site.

   WONK is deliberately absent. Fraunces' wonky alternates turn out not to
   touch the glyphs in this headline at all — comparing outlines at WONK 0
   and WONK 1 gives an identical contour, and the rendered line moves by
   0.24px. It was animating an axis that does nothing, so it was dropped.

   opsz does the visible work: dropping the optical size at a fixed render
   size thickens the strokes and flattens the contrast, which is what reads
   as ink spreading. SOFT rounds the terminals underneath it. */
const BASE: Axes = { SOFT: 0, opsz: 40 };
const NEAR: Axes = { SOFT: 92, opsz: 14 };

const RADIUS = 135; // px from a letter's centre where the bleed begins
const LERP = 0.12; // per-frame approach — lower is slower and heavier
const EPSILON = 0.4; // below this a letter counts as settled

function settings(a: Axes) {
  return `"SOFT" ${a.SOFT.toFixed(1)}, "opsz" ${a.opsz.toFixed(1)}`;
}

export default function ProximityText({
  text,
  className = "",
  radius = RADIUS,
}: {
  text: string;
  className?: string;
  radius?: number;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);

  // Words stay whole so line-breaking can never fall inside a word merely
  // because its letters happen to live in separate spans.
  const words = useMemo(() => text.split(" "), [text]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduced.matches || !fine.matches) return;

    const letters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-letter]"),
    );
    if (letters.length === 0) return;

    /* Centres are measured on layout changes, never per frame — reading a
       rect for every letter on every pointermove would thrash layout. */
    let centres: { x: number; y: number }[] = [];
    const measureCentres = () => {
      centres = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    /* These axes are NOT width-neutral: across this headline, opsz 40 -> 14
       alone is worth about 2.6% of the line. Left alone, every letter the
       cursor passes would shove its neighbours sideways and the headline
       would squirm. So each letter is pinned to the advance width it has at
       rest; the glyph then morphs inside a box that never changes size, and
       the line is laid out exactly once. Any growth is a fraction of a pixel
       of overlap, far below the wobble it replaces. */
    const lockWidths = () => {
      // Release and return to rest first, so what we measure is the true
      // resting advance rather than whatever the letter is mid-morph.
      for (const el of letters) {
        el.style.width = "";
        el.style.display = "";
        el.style.fontVariationSettings = settings(BASE);
      }
      // Batched: all writes above, then all reads, then all writes.
      const natural = letters.map((el) => el.getBoundingClientRect().width);
      letters.forEach((el, i) => {
        el.style.display = "inline-block";
        el.style.width = `${natural[i].toFixed(3)}px`;
        el.style.fontVariationSettings = settings(current[i]);
      });
      measureCentres();
    };

    const current: Axes[] = letters.map(() => ({ ...BASE }));
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let measureFrame = 0;
    let running = false;

    const tick = () => {
      let moving = false;

      for (let i = 0; i < letters.length; i++) {
        const c = centres[i];
        let pull = 0;

        if (pointer && c) {
          const d = Math.hypot(pointer.x - c.x, pointer.y - c.y);
          if (d < radius) {
            // easeOutCubic falloff: a soft plateau under the cursor that
            // tapers away gently instead of a hard cone edge.
            const t = 1 - d / radius;
            pull = 1 - Math.pow(1 - t, 3);
          }
        }

        const cur = current[i];
        let changed = false;

        for (const key of ["SOFT", "opsz"] as const) {
          const target = BASE[key] + (NEAR[key] - BASE[key]) * pull;
          const delta = target - cur[key];

          if (Math.abs(delta) > EPSILON) {
            cur[key] += delta * LERP;
            changed = true;
          } else if (cur[key] !== target) {
            cur[key] = target; // snap the last fraction so the loop can stop
            changed = true;
          }
        }

        if (changed) {
          letters[i].style.fontVariationSettings = settings(cur);
          moving = true;
        }
      }

      if (moving || pointer) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
        frame = 0;
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        frame = requestAnimationFrame(tick);
      }
    };

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      start();
    };

    // Leaving the window releases the letters rather than freezing them
    // mid-bleed under a cursor that is no longer there.
    const onLeave = () => {
      pointer = null;
      start();
    };

    // Scrolling only moves the letters, so the cheap centre read is enough.
    // A resize can rewrap or change the type size, so the widths are redone.
    const onScroll = () => {
      if (measureFrame) return;
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        measureCentres();
      });
    };
    const onResize = () => {
      if (measureFrame) return;
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        lockWidths();
      });
    };

    lockWidths();
    // Metrics shift when the webfont swaps in, so pin them again once it has
    // — locking against fallback metrics would freeze the wrong widths.
    if (document.fonts?.ready) void document.fonts.ready.then(lockWidths);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
      if (measureFrame) cancelAnimationFrame(measureFrame);
      letters.forEach((el) => {
        el.style.fontVariationSettings = "";
        el.style.width = "";
        el.style.display = "";
      });
    };
  }, [radius, words]);

  return (
    <span ref={rootRef} className={className} aria-hidden="true">
      {words.map((word, w) => (
        <span key={`${word}-${w}`}>
          {/* The word is kept whole and inline-block so a line can never
              break between two letters of one word. The separating space sits
              OUTSIDE that box — which is what preserves the break opportunity,
              and it must stay a plain space, never a non-breaking one. */}
          <span className="inline-block">
            {Array.from(word).map((ch, i) => (
              <span key={`${ch}-${i}`} data-letter>
                {ch}
              </span>
            ))}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
