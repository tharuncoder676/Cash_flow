"use client";

import { useEffect } from "react";

export default function SecurityShield() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // -------------------------------------------------------------
    // 1. Anti-Frame Hijacking (Clickjacking defense)
    // -------------------------------------------------------------
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = window.self.location.href;
      }
    } catch {
      window.location.replace("about:blank");
    }

    // -------------------------------------------------------------
    // 2. Global DevTools Hotkey Interception
    // Blocks F12, Ctrl/Cmd+Shift+(I,J,C,K), Ctrl/Cmd+U (View Source)
    // -------------------------------------------------------------
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key ? e.key.toLowerCase() : "";
      const code = e.code ? e.code.toLowerCase() : "";

      // F12 / DevTools
      if (e.keyCode === 123 || key === "f12" || code === "f12") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + Shift + (I, J, C, K)
      if (
        cmdOrCtrl &&
        e.shiftKey &&
        (key === "i" || key === "j" || key === "c" || key === "k")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + U -> View Source
      if (cmdOrCtrl && (key === "u" || key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Alt + Cmd + (I, J, C, U) (macOS Safari/Chrome)
      if (
        e.altKey &&
        e.metaKey &&
        (key === "i" || key === "j" || key === "c" || key === "u")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });

    // -------------------------------------------------------------
    // 3. Active DevTools Debugger Trap (Freezes Inspect immediately)
    // When someone right-clicks -> "Inspect" or opens DevTools,
    // the dynamic debugger loop halts and freezes the inspect thread.
    // -------------------------------------------------------------
    let trapInterval: ReturnType<typeof setInterval> | null = null;
    if (process.env.NODE_ENV === "production") {
      const runDebuggerTrap = () => {
        try {
          // Dynamic debugger invocation freezes inspect tabs the instant they are opened
          (function () {
            (function a() {
              try {
                (function b(i) {
                  if (("" + i / i).length !== 1 || i === 0) {
                    (function () {}).constructor("debugger")();
                  } else {
                    (function () {}).constructor("debugger")();
                  }
                  b(++i);
                })(0);
              } catch {}
            })();
          })();
        } catch {}
      };

      trapInterval = setInterval(runDebuggerTrap, 200);
    }

    // -------------------------------------------------------------
    // 4. Anti-Extension & Script Injection Sentinel (MutationObserver)
    // Destroys any unauthorized <script> injected by extensions or scrapers
    // -------------------------------------------------------------
    const trustedOrigins = [
      window.location.origin,
      "https://js.stripe.com",
      "https://m.stripe.network",
    ];

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as HTMLElement;
            if (el.tagName === "SCRIPT") {
              const scriptEl = el as HTMLScriptElement;
              const src = scriptEl.src;
              if (src) {
                const isTrusted = trustedOrigins.some((origin) => src.startsWith(origin));
                if (!isTrusted) {
                  scriptEl.remove();
                  if (typeof console !== "undefined" && console.clear) {
                    console.clear();
                  }
                }
              }
            }
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    // -------------------------------------------------------------
    // 5. Console Annihilation & Tamper-Proofing in Production
    // -------------------------------------------------------------
    if (process.env.NODE_ENV === "production") {
      try {
        const noop = () => {};
        window.console.log = noop;
        window.console.debug = noop;
        window.console.info = noop;
        window.console.dir = noop;
        window.console.table = noop;
        window.console.trace = noop;
      } catch {}
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      if (trapInterval) clearInterval(trapInterval);
      observer.disconnect();
    };
  }, []);

  return null;
}
