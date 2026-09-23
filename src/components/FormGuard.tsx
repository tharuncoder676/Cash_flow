"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Spam guards for the public forms. Neither needs a third-party service.
 *
 * - Honeypot: a field no person can see or tab to. Simple bots fill every
 *   input they find; if this arrives non-empty the server quietly accepts the
 *   request and stores nothing, so the bot learns nothing.
 * - Fill timer: how long the form was on screen before it was sent. A script
 *   posting the instant the page loads is rejected with a "try again" message
 *   a real person would only ever see if they were implausibly fast.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        overflow: "hidden",
        clipPath: "inset(50%)",
        whiteSpace: "nowrap",
      }}
    >
      <label>
        Leave this field empty
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </label>
    </div>
  );
}

/**
 * Returns `elapsed()` (ms since the form appeared) and `restart()` for forms
 * that are revealed later than their component mounts.
 */
export function useFillTimer() {
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const elapsed = useCallback(
    () => (startedAt.current ? Date.now() - startedAt.current : 0),
    [],
  );
  const restart = useCallback(() => {
    startedAt.current = Date.now();
  }, []);
  return { elapsed, restart };
}
