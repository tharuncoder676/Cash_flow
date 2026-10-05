"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { contact, whatsappUrl } from "@/content/course";

type ContextMenuPos = {
  visible: boolean;
  x: number;
  y: number;
  hasSelection: boolean;
};

export default function SecurityShield() {
  const [menu, setMenu] = useState<ContextMenuPos>({
    visible: false,
    x: 0,
    y: 0,
    hasSelection: false,
  });
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [devtoolsBlocked, setDevtoolsBlocked] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // -------------------------------------------------------------
    // 1. Anti-Frame Hijacking (Clickjacking Defense)
    // -------------------------------------------------------------
    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = window.self.location.href;
      }
    } catch {
      window.location.replace("about:blank");
    }

    // -------------------------------------------------------------
    // 2. Intercept Native Context Menu & Show Custom Branded Menu
    // Completely eliminates browser "Inspect" & "View Source" menu!
    // -------------------------------------------------------------
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const selection = window.getSelection()?.toString().trim();
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Ensure menu stays within viewport
      const menuWidth = 240;
      const menuHeight = 220;
      const posX = clickX + menuWidth > window.innerWidth ? window.innerWidth - menuWidth - 10 : clickX;
      const posY = clickY + menuHeight > window.innerHeight ? window.innerHeight - menuHeight - 10 : clickY;

      setMenu({
        visible: true,
        x: posX,
        y: posY,
        hasSelection: Boolean(selection && selection.length > 0),
      });
      return false;
    };

    const handleDismissMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    const handleScroll = () => {
      setMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("click", handleDismissMenu);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // -------------------------------------------------------------
    // 3. Global DevTools Key Combinations Interception
    // -------------------------------------------------------------
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;
      const key = e.key ? e.key.toLowerCase() : "";
      const code = e.code ? e.code.toLowerCase() : "";

      if (e.key === "Escape") {
        setMenu((prev) => ({ ...prev, visible: false }));
      }

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

      // Ctrl/Cmd + (U, S, P) -> View Source, Save, Print
      if (cmdOrCtrl && (key === "u" || key === "s" || key === "p")) {
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

    // -------------------------------------------------------------
    // 4. Active High-Frequency Debugger Freeze Trap
    // -------------------------------------------------------------
    const runDebuggerTrap = () => {
      try {
        const start = performance.now();
        (function () {}).constructor("debugger")();
        const duration = performance.now() - start;
        // If debugger paused execution, DevTools is active!
        if (duration > 100) {
          setDevtoolsBlocked(true);
        }
      } catch {}
    };

    const debuggerInterval = setInterval(runDebuggerTrap, 300);

    // -------------------------------------------------------------
    // 5. Anti-Extension & Script Injection Sentinel (MutationObserver)
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
    // 6. Production Console Annihilation
    // -------------------------------------------------------------
    try {
      const noop = () => {};
      window.console.log = noop;
      window.console.debug = noop;
      window.console.info = noop;
      window.console.dir = noop;
      window.console.table = noop;
      window.console.trace = noop;
    } catch {}

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("click", handleDismissMenu);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      clearInterval(debuggerInterval);
      observer.disconnect();
    };
  }, []);

  const handleCopy = () => {
    const text = window.getSelection()?.toString();
    if (text) {
      navigator.clipboard.writeText(text);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopyFeedback(true);
    setTimeout(() => {
      setCopyFeedback(false);
      setMenu((prev) => ({ ...prev, visible: false }));
    }, 800);
  };

  return (
    <>
      {/* Custom Luxury Context Menu — Replaces Browser's Inspect Menu */}
      {menu.visible && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Page options"
          style={{
            position: "fixed",
            left: `${menu.x}px`,
            top: `${menu.y}px`,
            zIndex: 999999,
          }}
          className="w-60 overflow-hidden rounded-xs border border-ink-700/20 bg-ink-900/95 text-paper-100 shadow-[0_20px_50px_-15px_rgba(5,14,36,0.8)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none font-sans"
        >
          {/* Header */}
          <div className="border-b border-paper-100/10 px-3.5 py-2.5 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-gold-400">
              Cash Flow Mastery
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse" />
          </div>

          <div className="p-1.5 space-y-0.5 text-[13px]">
            {/* Copy Action */}
            <button
              type="button"
              onClick={handleCopy}
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-paper-200 hover:bg-gold-500/15 hover:text-gold-300 transition-colors cursor-pointer"
            >
              <span>{menu.hasSelection ? "Copy selected text" : "Copy page link"}</span>
              <span className="font-mono text-[10px] text-paper-300/50">
                {copyFeedback ? "✓ Copied" : "📋"}
              </span>
            </button>

            {/* Quick Links */}
            <Link
              href="/#why"
              onClick={() => setMenu((prev) => ({ ...prev, visible: false }))}
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-paper-200 hover:bg-gold-500/15 hover:text-gold-300 transition-colors"
            >
              <span>13-Week Cash Model</span>
              <span className="font-mono text-[10px] text-gold-400">📊</span>
            </Link>

            <Link
              href="/course"
              onClick={() => setMenu((prev) => ({ ...prev, visible: false }))}
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-paper-200 hover:bg-gold-500/15 hover:text-gold-300 transition-colors"
            >
              <span>The 4-Week Programme</span>
              <span className="font-mono text-[10px] text-gold-400">📘</span>
            </Link>

            <Link
              href="/diagnostic"
              onClick={() => setMenu((prev) => ({ ...prev, visible: false }))}
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-paper-200 hover:bg-gold-500/15 hover:text-gold-300 transition-colors"
            >
              <span>Free Diagnostic Tool</span>
              <span className="font-mono text-[10px] text-gold-400">⚡</span>
            </Link>

            <a
              href={whatsappUrl("Hi Carl, I'd like to ask a question about Cash Flow Mastery.")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenu((prev) => ({ ...prev, visible: false }))}
              className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-gold-400 hover:bg-gold-500/15 hover:text-gold-300 transition-colors border-t border-paper-100/10 mt-1 pt-2"
            >
              <span>Talk to Carl (WhatsApp)</span>
              <span className="text-xs">↗</span>
            </a>
          </div>

          {/* Footer badge */}
          <div className="border-t border-paper-100/10 bg-ink-950 px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-wider text-paper-300/40 text-center">
            Independent Advisors · Protected
          </div>
        </div>
      )}

      {/* DevTools Active Blackout Overlay */}
      {devtoolsBlocked && (
        <div
          role="alert"
          style={{ zIndex: 9999999 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-ink-900/98 p-6 text-center text-paper-100 backdrop-blur-xl"
        >
          <div className="max-w-md rounded-xs border border-gold-500/30 bg-ink-800 p-8 shadow-2xl">
            <span className="inline-block h-3 w-3 rounded-full bg-signal-low animate-ping mb-4" />
            <h2 className="font-display text-2xl text-paper-100">
              Developer Tools Restricted
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-paper-300/80">
              Inspection and source code extraction are disabled on this application to protect proprietary financial algorithms and client assets.
            </p>
            <p className="mt-4 font-mono text-xs text-gold-400">
              Please close developer tools to restore full page access.
            </p>
            <button
              type="button"
              onClick={() => setDevtoolsBlocked(false)}
              className="mt-6 rounded-xs bg-gold-600 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-900 font-bold hover:bg-gold-500 transition-colors"
            >
              Dismiss Notice
            </button>
          </div>
        </div>
      )}
    </>
  );
}
