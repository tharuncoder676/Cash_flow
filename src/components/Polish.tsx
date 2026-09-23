"use client";

import { useEffect } from "react";

/**
 * Two pointer-driven refinements, both deliberately quiet.
 *
 * 1. Spotlight — the navy bands lift very slightly under the cursor, as if
 *    a lamp were being moved across the page. Nothing moves and nothing
 *    flashes; the band simply has depth where you are looking.
 *
 * 2. Magnetic buttons — primary calls to action lean a few pixels toward the
 *    cursor as it approaches, then spring back. It makes the target feel
 *    weighted rather than painted on.
 *
 * Both are pointer-only and both respect reduced motion, so touch users and
 * anyone who has asked for less movement get the static page.
 */
export default function Polish() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduced.matches || !fine.matches) return;

    /* --- Spotlight on the dark bands --------------------------------- */

    const bands = Array.from(
      document.querySelectorAll<HTMLElement>(".band-ink"),
    );
    bands.forEach((b) => b.classList.add("has-spot"));

    const onBandMove = (event: PointerEvent) => {
      const band = event.currentTarget as HTMLElement;
      const r = band.getBoundingClientRect();
      band.style.setProperty("--spot-x", `${event.clientX - r.left}px`);
      band.style.setProperty("--spot-y", `${event.clientY - r.top}px`);
      band.style.setProperty("--spot-on", "1");
    };
    const onBandLeave = (event: PointerEvent) => {
      (event.currentTarget as HTMLElement).style.setProperty("--spot-on", "0");
    };

    bands.forEach((band) => {
      band.addEventListener("pointermove", onBandMove);
      band.addEventListener("pointerleave", onBandLeave);
    });

    /* --- Magnetic primary buttons ------------------------------------ */

    const magnets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]"),
    );
    const RANGE = 90; // px beyond the button where the pull begins
    const PULL = 0.22; // fraction of the offset the button travels

    const onPointerMove = (event: PointerEvent) => {
      for (const el of magnets) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const dist = Math.hypot(dx, dy);
        const reach = Math.max(r.width, r.height) / 2 + RANGE;

        if (dist < reach) {
          const falloff = 1 - dist / reach;
          el.style.translate = `${dx * PULL * falloff}px ${dy * PULL * falloff}px`;
        } else if (el.style.translate) {
          el.style.translate = "";
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      bands.forEach((band) => {
        band.removeEventListener("pointermove", onBandMove);
        band.removeEventListener("pointerleave", onBandLeave);
        band.classList.remove("has-spot");
      });
      window.removeEventListener("pointermove", onPointerMove);
      magnets.forEach((el) => {
        el.style.translate = "";
      });
    };
  }, []);

  return null;
}
