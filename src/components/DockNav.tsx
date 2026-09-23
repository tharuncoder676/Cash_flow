"use client";

import Link from "next/link";
import { ViewTransition, useEffect, useRef } from "react";

/**
 * Dock-style navigation.
 *
 * The magnification behaviour is React Bits' Dock: items swell as the cursor
 * approaches and settle as it leaves, weighted by distance. Three things are
 * deliberately different, and each one is the reason this is a port rather
 * than a copy.
 *
 * 1. REAL LINKS. The original renders `<div role="button" onClick>`. In a
 *    site header that would strip every genuine href out of the navigation:
 *    no middle-click, no open-in-new-tab, no copy-link, and nothing for a
 *    crawler to follow between pages. These are `next/link` anchors.
 *
 * 2. SCALE, NOT WIDTH. The original animates each item's width, so hovered
 *    items shove their neighbours sideways. That is right for a macOS dock
 *    approached from below, and wrong for a row of text links approached
 *    head-on — the target you are aiming at moves out from under the
 *    cursor. Scaling leaves layout untouched, so nothing shifts.
 *
 * 3. NO `motion` DEPENDENCY. The spring is the same hand-rolled rAF lerp
 *    used elsewhere in this codebase (see ProximityText, Polish), which
 *    keeps the site at zero animation dependencies.
 *
 * Pointer-only and reduced-motion aware: touch users and anyone who asked
 * for less movement get the plain nav, which is what the markup already is.
 */

const MAX_SCALE = 1.18; // peak size directly under the cursor
/* Reach has to span more than one item or this is just a hover zoom. With
   gap-8 between links the neighbouring centres sit ~140-150px away, so 130
   caught nothing but the item under the cursor; 230 lets the two either
   side lift slightly and the row reads as one bulge. */
const REACH = 230;
const LERP = 0.18; // per-frame approach
const EPSILON = 0.002;

export default function DockNav({
  items,
  pathname,
}: {
  items: { href: string; label: string }[];
  pathname: string;
}) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(pointer: fine)");
    if (reduced.matches || !fine.matches) return;

    const links = Array.from(nav.querySelectorAll<HTMLElement>("[data-dock-item]"));
    if (links.length === 0) return;

    let centres: number[] = [];
    const measure = () => {
      centres = links.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left + r.width / 2;
      });
    };

    const current = links.map(() => 1);
    let pointerX: number | null = null;
    let frame = 0;
    let measureFrame = 0;
    let running = false;

    const tick = () => {
      let moving = false;

      for (let i = 0; i < links.length; i++) {
        let target = 1;
        if (pointerX !== null && centres[i] !== undefined) {
          const d = Math.abs(pointerX - centres[i]);
          if (d < REACH) {
            // Cosine falloff: a rounded swell rather than a cone, which is
            // what makes a dock read as a bulge instead of a spike.
            const t = 1 - d / REACH;
            target = 1 + (MAX_SCALE - 1) * (0.5 - Math.cos(Math.PI * t) / 2);
          }
        }

        const delta = target - current[i];
        if (Math.abs(delta) > EPSILON) {
          current[i] += delta * LERP;
          moving = true;
        } else if (current[i] !== target) {
          current[i] = target;
          moving = true;
        }

        if (moving) {
          // Compared with a tolerance, not `=== 1`: the lerp lands on
          // 1.0000001 and an exact test leaves a scale(1) behind, which
          // pins a compositing layer on a link that is not animating.
          links[i].style.transform =
            Math.abs(current[i] - 1) < 0.0005
              ? ""
              : `scale(${current[i].toFixed(4)})`;
        }
      }

      if (moving || pointerX !== null) {
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

    // Listening on the header rather than the window: the dock should react
    // as you approach it, not follow the cursor around the whole page.
    const host = nav.parentElement ?? nav;
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      start();
    };
    const onLeave = () => {
      pointerX = null;
      start();
    };

    const remeasure = () => {
      if (measureFrame) return;
      measureFrame = requestAnimationFrame(() => {
        measureFrame = 0;
        measure();
      });
    };

    measure();
    if (document.fonts?.ready) void document.fonts.ready.then(measure);

    host.addEventListener("pointermove", onMove as EventListener, { passive: true });
    host.addEventListener("pointerleave", onLeave as EventListener, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, { passive: true });

    return () => {
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave as EventListener);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure);
      if (frame) cancelAnimationFrame(frame);
      if (measureFrame) cancelAnimationFrame(measureFrame);
      links.forEach((el) => {
        el.style.transform = "";
      });
    };
  }, [items]);

  return (
    <nav
      ref={navRef}
      className="hidden items-center gap-8 lg:flex"
      aria-label="Main navigation"
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            data-dock-item
            aria-current={active ? "page" : undefined}
            className={`dock-link relative font-mono text-[11.5px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 ${
              active ? "text-ink-900" : "text-ink-800/80 hover:text-ink-900"
            }`}
          >
            {item.label}
            {/* One named underline, rendered only under the active link. On
                navigation the browser morphs it from the old link to the new
                one, so it visibly slides across rather than reappearing. */}
            {active && (
              <ViewTransition name="nav-underline" share="morph" default="none">
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 left-0 h-px w-full bg-gold-600"
                />
              </ViewTransition>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
