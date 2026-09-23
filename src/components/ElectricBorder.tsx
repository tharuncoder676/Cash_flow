"use client";

// CREDIT
// Component inspired by @BalintFerenczy on X
// https://codepen.io/BalintFerenczy/pen/KwdoyEN
// Adapted from React Bits (MIT) — ported to TypeScript, retinted to the
// gold ramp, and gated so it only burns frames when it is actually on screen.

import { useCallback, useEffect, useRef } from "react";

/**
 * A live hairline that traces the edge of whatever it wraps.
 *
 * The border is a rounded rectangle sampled into a few hundred points, each
 * pushed off the path by layered value-noise that drifts over time — so the
 * line stays continuous but never repeats, like a filament rather than a
 * marquee. Around Carl's portrait it reads as the gold rule that frames the
 * rest of the site, except alive.
 *
 * Two departures from the original, both about cost. It is a canvas redrawn
 * every frame, so it runs ONLY while it is in the viewport (an idle portrait
 * three screens down was otherwise repainting forever), and it degrades to a
 * plain static border under prefers-reduced-motion rather than simply
 * animating faster or slower.
 */
export default function ElectricBorder({
  children,
  color = "#a87a2a", // gold-600, the site's signature accent
  speed = 1.1,
  chaos = 0.12,
  thickness = 2,
  displacement = 14,
  borderRadius = 2, // matches rounded-xs; this site is deliberately sharp
  className = "",
  style,
}: {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  thickness?: number;
  /** How far the filament may stray from the true edge, in px. The original
   *  ships 60, which on a 258px-wide portrait swings the line about 17px out
   *  and reads as a crayon scribble rather than a gold hairline. Kept small
   *  so the frame shimmers against the edge instead of wandering off it. */
  displacement?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* --- value noise ------------------------------------------------- */

  const random = useCallback((x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1, []);

  const noise2D = useCallback(
    (x: number, y: number) => {
      const i = Math.floor(x);
      const j = Math.floor(y);
      const fx = x - i;
      const fy = y - j;
      const a = random(i + j * 57);
      const b = random(i + 1 + j * 57);
      const c = random(i + (j + 1) * 57);
      const d = random(i + 1 + (j + 1) * 57);
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
    },
    [random],
  );

  const octavedNoise = useCallback(
    (x: number, time: number, seed: number, amplitude0: number) => {
      const OCTAVES = 10;
      const LACUNARITY = 1.6;
      const GAIN = 0.7;
      let y = 0;
      let amplitude = amplitude0;
      let frequency = 10;
      for (let i = 0; i < OCTAVES; i++) {
        // The first octave is flattened to zero so the line hugs the true
        // edge and only the finer octaves make it shimmer.
        const octaveAmplitude = i === 0 ? 0 : amplitude;
        y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= LACUNARITY;
        amplitude *= GAIN;
      }
      return y;
    },
    [noise2D],
  );

  /* --- rounded-rect path parameterised by perimeter ----------------- */

  const pointAt = useCallback(
    (t: number, left: number, top: number, w: number, h: number, r: number) => {
      const sw = w - 2 * r;
      const sh = h - 2 * r;
      const arc = (Math.PI * r) / 2;
      const total = 2 * sw + 2 * sh + 4 * arc;
      let d = t * total;
      const corner = (cx: number, cy: number, start: number, p: number) => ({
        x: cx + r * Math.cos(start + p * (Math.PI / 2)),
        y: cy + r * Math.sin(start + p * (Math.PI / 2)),
      });

      if (d <= sw) return { x: left + r + d, y: top };
      d -= sw;
      if (d <= arc) return corner(left + w - r, top + r, -Math.PI / 2, d / arc);
      d -= arc;
      if (d <= sh) return { x: left + w, y: top + r + d };
      d -= sh;
      if (d <= arc) return corner(left + w - r, top + h - r, 0, d / arc);
      d -= arc;
      if (d <= sw) return { x: left + w - r - d, y: top + h };
      d -= sw;
      if (d <= arc) return corner(left + r, top + h - r, Math.PI / 2, d / arc);
      d -= arc;
      if (d <= sh) return { x: left, y: top + h - r - d };
      d -= sh;
      return corner(left + r, top + r, Math.PI, d / arc);
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* The canvas is grown past the element on every side so the filament has
       somewhere to stray into without being clipped — but ONLY by as much as
       the filament can actually travel. The original hard-codes 60px, and
       because that overhang is real layout on the right edge it pushed a
       390px phone out to a 426px scroll width. Deriving it from the
       displacement keeps the frame inside the viewport at every width. */
    const OFFSET = Math.ceil(displacement + thickness + 6);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let last = 0;
    let frame = 0;
    let visible = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width + OFFSET * 2;
      height = rect.height + OFFSET * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const bw = width - 2 * OFFSET;
      const bh = height - 2 * OFFSET;
      if (bw <= 0 || bh <= 0) return;
      const radius = Math.min(borderRadius, Math.min(bw, bh) / 2);

      const perimeter = 2 * (bw + bh) + 2 * Math.PI * radius;
      const samples = Math.max(32, Math.floor(perimeter / 2));

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const t = i / samples;
        const p = pointAt(t, OFFSET, OFFSET, bw, bh, radius);
        const nx = octavedNoise(t * 8, time, 0, chaos);
        const ny = octavedNoise(t * 8, time, 1, chaos);
        const x = p.x + nx * displacement;
        const y = p.y + ny * displacement;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const tick = (now: number) => {
      if (!visible) {
        frame = 0;
        return;
      }
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      time += dt * speed;
      draw();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || reduced.matches) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    resize();
    if (reduced.matches) {
      // Still draw once: the frame is part of the composition, only its
      // movement is what was opted out of.
      draw();
    }

    // Only burn frames while the element is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "120px" },
    );
    io.observe(container);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced.matches) draw();
    });
    ro.observe(container);

    const onMotionChange = () => {
      stop();
      if (reduced.matches) draw();
      else if (visible) start();
    };
    reduced.addEventListener("change", onMotionChange);

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      reduced.removeEventListener("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [color, speed, chaos, thickness, displacement, borderRadius, octavedNoise, pointAt]);

  return (
    <div
      ref={containerRef}
      className={`electric-border ${className}`}
      style={{ ...style, ["--eb-color" as string]: color, borderRadius }}
    >
      <div className="eb-canvas-wrap" aria-hidden="true">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers" aria-hidden="true">
        <span className="eb-glow-1" />
        <span className="eb-glow-2" />
        <span className="eb-bloom" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
}
