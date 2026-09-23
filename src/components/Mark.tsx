import type { ReactNode } from "react";

/**
 * A highlighter stroke behind a phrase.
 *
 * The site's one signature flourish — used on the single most important
 * phrase in a section and nowhere else. Overused it becomes a tic; used
 * four or five times across the whole site it reads as a hand marking up
 * the page.
 *
 * `data-reveal` is intentionally absent: the Motion driver picks the
 * element up by its `.mark` class through the same observer, so the sweep
 * fires when the line arrives rather than when its container does.
 */
export default function Mark({
  children,
  tone = "light",
  display = false,
  delay,
}: {
  children: ReactNode;
  /** "dark" for the navy bands, where the brighter gold is needed. */
  tone?: "light" | "dark";
  /** Heavier bar, for display-size type. */
  display?: boolean;
  delay?: number;
}) {
  const classes = [
    "mark",
    tone === "dark" && "mark-dark",
    display && "mark-display",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </span>
  );
}
