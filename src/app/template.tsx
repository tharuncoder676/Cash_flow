import { ViewTransition } from "react";

/**
 * Page-to-page transition.
 *
 * A template, not the layout: layouts persist across navigations, so a
 * ViewTransition there would never see its content enter or leave. Next.js
 * remounts a template on every route change, which is exactly the moment the
 * old page should fade out and the new one rise in.
 *
 * `default="none"` keeps this wrapper silent for everything that is not a
 * route change — the forecast sliders, the diagnostic steps, form states.
 * Timing, the anchored header and reduced-motion handling live in globals.css.
 *
 * The plain <div> gives the transition one box to snapshot. Without it, a
 * page made of several top-level sections would animate as several pieces.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
