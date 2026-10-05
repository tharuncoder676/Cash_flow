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
      // Access to window.top blocked by cross-origin iframe -> break out
      window.location.replace("about:blank");
    }

    // -------------------------------------------------------------
    // 2. Global DevTools & Source Inspection Key Combinations Lock
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

      // Ctrl/Cmd + Shift + (I, J, C, K) -> DevTools, Console, Element Picker
      if (
        cmdOrCtrl &&
        e.shiftKey &&
        (key === "i" || key === "j" || key === "c" || key === "k")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + U -> View Page Source
      if (cmdOrCtrl && (key === "u" || key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Alt + Cmd + (I, J, C, U) (macOS Safari/Chrome DevTools & View Source)
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
    // 3. Anti-Extension & Script Injection Sentinel (MutationObserver)
    // Intercepts and immediately removes unauthorized dynamically injected scripts
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
              // If external script is not from a trusted origin, terminate it
              if (src) {
                const isTrusted = trustedOrigins.some((origin) => src.startsWith(origin));
                if (!isTrusted) {
                  scriptEl.remove();
                  console.clear();
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
    // 4. Active DevTools Detection & Console Annihilation
    // -------------------------------------------------------------
    let devtoolsOpen = false;
    const threshold = 160;

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          try {
            console.clear();
            const warningStyle =
              "color: #b4472f; font-size: 20px; font-weight: bold; background: #050e24; padding: 6px 10px; font-family: monospace;";
            console.log("%c🔒 ACCESS RESTRICTED: PROPRIETARY SYSTEM", warningStyle);
            console.log(
              "%cAll client resources, algorithms, and source assets are copyrighted by Independent Advisors. Reverse engineering, inspection, and extraction attempts are restricted.",
              "color: #d4a24c; font-size: 12px; font-family: monospace;"
            );
          } catch {}
        }
      } else {
        devtoolsOpen = false;
      }
    };

    const devtoolsInterval = setInterval(detectDevTools, 600);
    window.addEventListener("resize", detectDevTools);

    // -------------------------------------------------------------
    // 5. Freeze Console in Production to Prevent State Inspection
    // -------------------------------------------------------------
    if (process.env.NODE_ENV === "production") {
      try {
        const noop = () => {};
        window.console.log = noop;
        window.console.debug = noop;
        window.console.info = noop;
        window.console.dir = noop;
        window.console.table = noop;
      } catch {}
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("resize", detectDevTools);
      clearInterval(devtoolsInterval);
      observer.disconnect();
    };
  }, []);

  return null;
}
