"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./Icons";
import { site, whatsappUrl } from "@/content/course";

/**
 * Floating WhatsApp button, as on independentadvisors.ai.
 *
 * Kept in WhatsApp's own green: the colour is the affordance, and recolouring
 * it to the brand palette would cost more in recognition than it gains in
 * tidiness. Bottom-right, as on independentadvisors.ai — and it lifts above
 * the sticky enrolment bar when that bar is showing, so the two never
 * overlap.
 *
 * The label expands on hover and on keyboard focus, so the button is not a
 * mystery icon to anyone.
 */
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 0.5);

      // Measure the enrolment bar rather than duplicating its show/hide
      // rules, so the two can never disagree about who is on screen.
      const bar = document.querySelector<HTMLElement>("[data-enrol-bar]");
      if (!bar) {
        setLifted(false);
        return;
      }
      const style = window.getComputedStyle(bar);
      setLifted(Number(style.opacity) > 0.05);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <a
      href={whatsappUrl(`Hi Carl — I have a question about ${site.name}.`)}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      style={{ bottom: lifted ? "calc(var(--enrol-bar-h, 88px) + 16px)" : undefined }}
      className={`group fixed right-5 z-50 flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] py-3.5 pl-3.5 pr-3.5 text-ink-900 shadow-[0_12px_30px_-10px_rgba(5,14,36,0.55)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:gap-2.5 hover:pr-5 focus-visible:gap-2.5 focus-visible:pr-5 sm:right-7 ${
        lifted ? "" : "bottom-5 sm:bottom-7"
      } ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-3 scale-90 opacity-0"
      }`}
    >
      <WhatsAppIcon className="h-6 w-6 shrink-0" />
      <span className="max-w-0 whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.12em] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[13rem] group-hover:opacity-100 group-focus-visible:max-w-[13rem] group-focus-visible:opacity-100">
        Chat with Carl
      </span>
    </a>
  );
}
