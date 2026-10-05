"use client";

import { useEffect } from "react";

export default function SecurityShield() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // 1. Authoritative Console Warning
    const showSecurityBanner = () => {
      const headerStyle =
        "color: #d4a24c; font-size: 20px; font-weight: bold; padding: 4px 8px; font-family: monospace;";
      const warningStyle =
        "color: #e8bc6c; font-size: 13px; line-height: 1.6; font-family: monospace;";
      const noticeStyle =
        "color: #5b6788; font-size: 11px; font-family: monospace; border-top: 1px solid rgba(212,162,76,0.3); padding-top: 4px;";

      console.log("%c🔒 INDEPENDENT ADVISORS — SECURITY SHIELD", headerStyle);
      console.log(
        "%cWARNING: Unauthorized source inspection, algorithmic replication, automated scraping, or reverse engineering of this platform is strictly monitored and legally protected.\nAll rights reserved by Independent Advisors & Cash Flow Mastery.",
        warningStyle
      );
      console.log(
        "%cClient Environment ID: " +
          Math.random().toString(36).substring(2, 10).toUpperCase() +
          " · Protected Asset",
        noticeStyle
      );
    };

    showSecurityBanner();

    // 2. Keyboard shortcut deterrence (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // F12
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + Shift + I (Inspect)
      // Ctrl/Cmd + Shift + J (Console)
      // Ctrl/Cmd + Shift + C (Inspect element)
      if (
        cmdOrCtrl &&
        e.shiftKey &&
        (e.key === "I" ||
          e.key === "i" ||
          e.key === "J" ||
          e.key === "j" ||
          e.key === "C" ||
          e.key === "c")
      ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + U (View Source)
      if (cmdOrCtrl && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl/Cmd + S (Save Page)
      if (cmdOrCtrl && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    // 3. Prevent context menu on interactive components / proprietary sections
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.closest("figure") ||
        target?.closest("svg") ||
        target?.closest(".brand-lockup") ||
        target?.closest("[data-secure]")
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("contextmenu", handleContextMenu, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
    };
  }, []);

  return null;
}
