"use client";

import { useEffect, useState, useRef } from "react";
import { contact, whatsappUrl } from "@/content/course";

type ContextMenuState = {
  visible: boolean;
  x: number;
  y: number;
  hasSelection: boolean;
  selectedText: string;
};

export default function SecurityShield() {
  const [menu, setMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    hasSelection: false,
    selectedText: "",
  });
  const [showQrModal, setShowQrModal] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
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
    // 2. Intercept Native Context Menu & Show Feature-Complete Menu
    // Has ALL standard browser options (Back, Forward, Reload, Print,
    // QR Code, Save, Cast, Translate) EXCLUDING "Inspect" & "View Source"
    // -------------------------------------------------------------
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const selection = window.getSelection()?.toString().trim() ?? "";
      const clickX = e.clientX;
      const clickY = e.clientY;

      const menuWidth = 270;
      const menuHeight = 440;
      const posX =
        clickX + menuWidth > window.innerWidth
          ? window.innerWidth - menuWidth - 12
          : clickX;
      const posY =
        clickY + menuHeight > window.innerHeight
          ? window.innerHeight - menuHeight - 12
          : clickY;

      setMenu({
        visible: true,
        x: Math.max(10, posX),
        y: Math.max(10, posY),
        hasSelection: selection.length > 0,
        selectedText: selection,
      });
      return false;
    };

    const handleDismiss = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      }
    };

    const handleScroll = () => {
      setMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };

    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("click", handleDismiss);
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
        setShowQrModal(false);
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

    // -------------------------------------------------------------
    // 4. Anti-Extension & Script Injection Sentinel (MutationObserver)
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
    // 5. Production Console Annihilation
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
      window.removeEventListener("click", handleDismiss);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      observer.disconnect();
    };
  }, []);

  const closeMenu = () => setMenu((prev) => ({ ...prev, visible: false }));

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
    closeMenu();
  };

  const handleBack = () => {
    closeMenu();
    window.history.back();
  };

  const handleForward = () => {
    closeMenu();
    window.history.forward();
  };

  const handleReload = () => {
    closeMenu();
    window.location.reload();
  };

  const handlePrint = () => {
    closeMenu();
    window.print();
  };

  const handleSaveAs = () => {
    closeMenu();
    const link = document.createElement("a");
    link.href = "/cash-flow-mastery-curriculum.pdf";
    link.download = "cash-flow-mastery-curriculum.pdf";
    link.click();
    showToast("Curriculum PDF saved");
  };

  const handleCopy = () => {
    if (menu.selectedText) {
      navigator.clipboard.writeText(menu.selectedText);
      showToast("Selected text copied");
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Page link copied");
    }
  };

  const handleGoogleLensOrSearch = () => {
    closeMenu();
    const q = menu.selectedText || document.title;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, "_blank");
  };

  const handleTranslate = () => {
    closeMenu();
    window.open(
      `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(window.location.href)}`,
      "_blank"
    );
  };

  const handleShare = async () => {
    closeMenu();
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {}
    } else {
      setShowQrModal(true);
    }
  };

  const toggleReadingMode = () => {
    closeMenu();
    const next = !readingMode;
    setReadingMode(next);
    document.body.style.filter = next ? "sepia(0.08) contrast(1.02)" : "";
    showToast(next ? "Reading mode enabled" : "Reading mode disabled");
  };

  return (
    <>
      {/* Toast Notification Feedback */}
      {feedback && (
        <div
          role="status"
          style={{ zIndex: 9999999 }}
          className="fixed bottom-6 right-6 rounded-xs bg-ink-900 px-4 py-2.5 font-mono text-xs text-gold-400 border border-gold-500/30 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          ✓ {feedback}
        </div>
      )}

      {/* Feature-Complete Native-Style Context Menu (Without Inspect/View Source) */}
      {menu.visible && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Browser context menu"
          style={{
            position: "fixed",
            left: `${menu.x}px`,
            top: `${menu.y}px`,
            zIndex: 999999,
          }}
          className="w-[260px] overflow-hidden rounded-md border border-[#333]/80 bg-[#1e1e1e]/95 py-1 text-[#e0e0e0] shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-md select-none font-sans text-[12.5px]"
        >
          {/* Top Navigation Row (Back, Forward, Reload) */}
          <div className="flex items-center justify-between px-2 py-1 border-b border-[#333]/60 mb-1">
            <button
              type="button"
              title="Back (Alt+Left Arrow)"
              onClick={handleBack}
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10 transition-colors text-white/90"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              type="button"
              title="Forward (Alt+Right Arrow)"
              onClick={handleForward}
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10 transition-colors text-white/90"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <button
              type="button"
              title="Reload (Ctrl+R)"
              onClick={handleReload}
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10 transition-colors text-white/90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
            </button>
            <button
              type="button"
              title="Copy"
              onClick={handleCopy}
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10 transition-colors text-white/90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
          </div>

          {/* AI / Advisor Action */}
          <a
            href={whatsappUrl("Hi Carl, I'm reviewing Cash Flow Mastery and would like to ask a question.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="flex items-center justify-between px-3 py-1.5 hover:bg-white/10 transition-colors text-white font-medium group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[#d4a24c] text-sm">✦</span>
              <span>Ask Carl / Advisor</span>
            </div>
            <span className="font-mono text-[10px] text-[#d4a24c]/90 bg-[#d4a24c]/15 px-1.5 py-0.5 rounded">WhatsApp</span>
          </a>

          <div className="my-1 border-t border-[#333]/60" />

          {/* Standard Browser Menu Items */}
          <button
            type="button"
            onClick={handleSaveAs}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 transition-colors text-left"
          >
            <span>Save page as...</span>
            <span className="text-[11px] text-white/40 font-mono">Ctrl+S</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 transition-colors text-left"
          >
            <span>Print...</span>
            <span className="text-[11px] text-white/40 font-mono">Ctrl+P</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 transition-colors text-left"
          >
            <span>Cast / Share...</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleLensOrSearch}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>{menu.hasSelection ? "Search with Google" : "Search this tab with Google"}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={toggleReadingMode}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 transition-colors text-left"
          >
            <span>{readingMode ? "Exit reading mode" : "Open in reading mode"}</span>
            <span className="text-[11px] text-white/40 font-mono">Alt+Shift+R</span>
          </button>

          <div className="my-1 border-t border-[#333]/60" />

          <button
            type="button"
            onClick={handleShare}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="6" height="6" x="3" y="3" rx="1"/><rect width="6" height="6" x="15" y="3" rx="1"/><rect width="6" height="6" x="3" y="15" rx="1"/><path d="M15 15h6v6h-6z"/></svg>
              <span>Create QR Code for this page</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleTranslate}
            className="flex w-full items-center justify-between px-3 py-1.5 hover:bg-white/10 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
              <span>Translate page</span>
            </div>
          </button>

          {/* Notice: "View page source" and "Inspect" are intentionally omitted! */}
        </div>
      )}

      {/* QR Code Sharing Dialog Modal */}
      {showQrModal && (
        <div
          role="dialog"
          aria-label="QR Code for this page"
          style={{ zIndex: 9999999 }}
          className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-xs border border-ink-700/20 bg-paper-100 p-6 text-center text-ink-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 text-ink-400 hover:text-ink-900 font-mono text-sm"
            >
              ✕
            </button>

            <h3 className="font-display text-xl text-ink-900">
              Scan with mobile device
            </h3>
            <p className="mt-1 text-xs text-ink-400">
              Open Cash Flow Mastery instantly on your phone or tablet
            </p>

            <div className="my-5 flex justify-center">
              {/* High resolution QR Code generator */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : "https://cash-flow-mastery.vercel.app"
                )}&color=0b1e45&bgcolor=fbf8f1`}
                alt="QR Code link"
                width={180}
                height={180}
                className="rounded-xs border border-ink-700/15 p-2 bg-paper-50 shadow-inner"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast("Page link copied to clipboard");
                setShowQrModal(false);
              }}
              className="w-full rounded-xs bg-ink-700 py-2.5 font-mono text-xs uppercase tracking-wider text-paper-100 font-semibold hover:bg-ink-900 transition-colors"
            >
              Copy Page Link
            </button>
          </div>
        </div>
      )}
    </>
  );
}
