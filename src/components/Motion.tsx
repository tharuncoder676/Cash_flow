"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide motion driver.
 *
 * One IntersectionObserver handles every `data-reveal` and `data-draw-line`
 * element, plus `data-count` figures. A single rAF loop drives the header
 * scroll rail.
 *
 * Nothing is hidden until `js-on` lands on <html>, so with JavaScript off —
 * or if hydration fails — the page renders complete and readable.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-on");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const targets = Array.from(
      // `.mark` joins the same observer so each highlighter stroke fires
      // when its own line arrives, not when its section does.
      document.querySelectorAll<HTMLElement>(
        "[data-reveal], [data-draw-line], .mark",
      ),
    );
    const counters = Array.from(
      document.querySelectorAll<HTMLElement>("[data-count]"),
    );

    /* --- Reveals ------------------------------------------------- */

    const show = (el: HTMLElement) => {
      el.classList.add("is-shown");
      if (el.hasAttribute("data-count")) runCount(el, reduced);
    };

    // A mark only collapses to zero width once we know it will be swept.
    const arm = (el: HTMLElement) => {
      if (el.classList.contains("mark")) el.classList.add("will-sweep");
    };

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach(show);
      counters.forEach((el) => runCount(el, true));
      return () => root.classList.remove("js-on");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    const all = new Set([...targets, ...counters]);
    for (const el of all) {
      // Anything already on screen at load reveals immediately, in sequence,
      // rather than waiting for a scroll that may never come.
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
        arm(el);
        show(el);
      } else {
        arm(el);
        observer.observe(el);
      }
    }

    // Safety net: anything still unrevealed after a few seconds is shown
    // regardless, so a missed observer can never leave content invisible.
    const failsafe = window.setTimeout(() => {
      for (const el of all) if (!el.classList.contains("is-shown")) show(el);
    }, 6000);

    /* --- Header scroll rail -------------------------------------- */

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.body.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        root.style.setProperty("--scroll-progress", p.toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("js-on");
    };
  }, [pathname]);

  return null;
}

/* ------------------------------------------------------------------ */

/**
 * Counts a figure up to its final value. The element's text is already the
 * final value in the HTML, so this only ever animates *to* what is rendered.
 */
function runCount(el: HTMLElement, reduced: boolean) {
  if (el.dataset.counted === "1") return;
  el.dataset.counted = "1";

  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;

  const suffix = el.dataset.countSuffix ?? "";
  const prefix = el.dataset.countPrefix ?? "";
  const format = (n: number) =>
    `${prefix}${Math.round(n).toLocaleString("en-AE")}${suffix}`;

  if (reduced) {
    el.textContent = format(target);
    return;
  }

  const duration = 1100;
  const start = performance.now();

  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1);
    // easeOutExpo — fast start, long settle.
    const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    el.textContent = format(target * eased);
    if (t < 1) requestAnimationFrame(step);
  };

  el.textContent = format(0);
  requestAnimationFrame(step);
}
