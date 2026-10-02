"use client";

import { useState, useEffect } from "react";
import CashFlowMark from "./CashFlowMark";
import { site, carl, whatsappUrl } from "@/content/course";

export type ReceiptData = {
  orderId: string;
  sessionReference: string;
  email: string | null;
  name: string | null;
  tierName: string;
  amountFormatted: string;
  dateFormatted: string;
  seatNumber?: number | string;
  cohortStart: string;
  currency: string;
};

export default function InteractiveReceipt({ data }: { data: ReceiptData }) {
  const [copied, setCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDispensed, setIsDispensed] = useState(false);
  const [feedKey, setFeedKey] = useState(0);

  // Automatically trigger dispenser feed on initial page load
  useEffect(() => {
    // Small initial delay so user sees the dispenser before it starts printing
    const startTimer = setTimeout(() => {
      triggerPrint();
    }, 400);
    return () => clearTimeout(startTimer);
  }, []);

  const triggerPrint = () => {
    setIsDispensed(false);
    // Allow React state reset then start feed
    setTimeout(() => {
      setIsDispensed(true);
      setIsPrinting(true);
      setFeedKey((k) => k + 1);
    }, 50);

    const finishTimer = setTimeout(() => {
      setIsPrinting(false);
    }, 2400);
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleBrowserPrint = () => {
    window.print();
  };

  const makeCalendarUrl = () => {
    const title = encodeURIComponent(`${site.name} — Live Cohort Session`);
    const details = encodeURIComponent(
      `Official Registration for Cash Flow Mastery.\nTaught by ${carl.name}, ${carl.credentials}.\nOrder ID: ${data.orderId}\nLive clinic dates and access links will be dispatched via email prior to week 1.`
    );
    const location = encodeURIComponent("Online Live Clinic (GST / UTC+4)");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="my-10 w-full max-w-xl mx-auto font-sans">
      <style jsx global>{`
        /* Smooth Height Expansion pushing controls down */
        @keyframes expandDispenserSlot {
          0% {
            grid-template-rows: 0fr;
            opacity: 0.2;
          }
          10% {
            grid-template-rows: 0.1fr;
            opacity: 1;
          }
          25% {
            grid-template-rows: 0.28fr;
          }
          30% {
            grid-template-rows: 0.28fr;
          }
          45% {
            grid-template-rows: 0.5fr;
          }
          50% {
            grid-template-rows: 0.5fr;
          }
          65% {
            grid-template-rows: 0.7fr;
          }
          70% {
            grid-template-rows: 0.7fr;
          }
          85% {
            grid-template-rows: 0.88fr;
          }
          90% {
            grid-template-rows: 0.88fr;
          }
          100% {
            grid-template-rows: 1fr;
            opacity: 1;
          }
        }

        /* Physical downward paper translation */
        @keyframes thermalPaperSlide {
          0% {
            transform: translateY(-100%);
          }
          10% {
            transform: translateY(-90%);
          }
          25% {
            transform: translateY(-72%);
          }
          30% {
            transform: translateY(-72%);
          }
          45% {
            transform: translateY(-50%);
          }
          50% {
            transform: translateY(-50%);
          }
          65% {
            transform: translateY(-30%);
          }
          70% {
            transform: translateY(-30%);
          }
          85% {
            transform: translateY(-12%);
          }
          90% {
            transform: translateY(-12%);
          }
          100% {
            transform: translateY(0%);
          }
        }

        .animate-dispenser-expand {
          animation: expandDispenserSlot 2.3s cubic-bezier(0.2, 0.85, 0.35, 1) forwards;
        }

        .animate-paper-slide {
          animation: thermalPaperSlide 2.3s cubic-bezier(0.2, 0.85, 0.35, 1) forwards;
        }

        .receipt-serrated-top {
          clip-path: polygon(
            0% 8px, 1.5% 0px, 3% 8px, 4.5% 0px, 6% 8px, 7.5% 0px, 9% 8px, 10.5% 0px, 12% 8px, 13.5% 0px,
            15% 8px, 16.5% 0px, 18% 8px, 19.5% 0px, 21% 8px, 22.5% 0px, 24% 8px, 25.5% 0px, 27% 8px, 28.5% 0px,
            30% 8px, 31.5% 0px, 33% 8px, 34.5% 0px, 36% 8px, 37.5% 0px, 39% 8px, 40.5% 0px, 42% 8px, 43.5% 0px,
            45% 8px, 46.5% 0px, 48% 8px, 49.5% 0px, 51% 8px, 52.5% 0px, 54% 8px, 55.5% 0px, 57% 8px, 58.5% 0px,
            60% 8px, 61.5% 0px, 63% 8px, 64.5% 0px, 66% 8px, 67.5% 0px, 69% 8px, 70.5% 0px, 72% 8px, 73.5% 0px,
            75% 8px, 76.5% 0px, 78% 8px, 79.5% 0px, 81% 8px, 82.5% 0px, 84% 8px, 85.5% 0px, 87% 8px, 88.5% 0px,
            90% 8px, 91.5% 0px, 93% 8px, 94.5% 0px, 96% 8px, 97.5% 0px, 99% 8px, 100% 0px,
            100% 100%, 0% 100%
          );
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900">
          Advance Receipt Print
        </h3>
      </div>

      {/* ========================================================================= */}
      {/* 1. SKEUOMORPHIC 3D PILL DISPENSER BAR                                     */}
      {/* ========================================================================= */}
      <div className="relative mx-auto w-full max-w-[480px] z-30">
        <div className="relative h-15 sm:h-16 w-full rounded-full bg-gradient-to-b from-[#1C2638] via-[#0E1626] to-[#040812] px-5 py-2 shadow-[0_22px_45px_-8px_rgba(4,8,18,0.7),0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.22)] border border-slate-700/60 flex items-center justify-between">
          
          {/* Top Specular Reflection Highlight */}
          <div className="absolute top-1.5 inset-x-12 h-[1.5px] bg-gradient-to-r from-transparent via-white/35 to-transparent rounded-full pointer-events-none" />

          {/* Left: Glowing Green Vertical LED Indicator */}
          <div className="relative flex items-center justify-center shrink-0">
            <span
              className={`h-4 w-1.5 rounded-full transition-all duration-300 ${
                isPrinting
                  ? "bg-emerald-400 shadow-[0_0_14px_#34d399,0_0_4px_#10b981] animate-pulse"
                  : "bg-emerald-500 shadow-[0_0_8px_#10b981]"
              }`}
            />
          </div>

          {/* Center: Recessed Slit Mouth with Dotted Dash Matrix */}
          <div className="relative mx-3 h-3.5 flex-1 rounded-full bg-black/95 shadow-[inset_0_3px_6px_rgba(0,0,0,1)] border-t border-black border-b border-white/10 flex items-center justify-center px-4 overflow-hidden">
            {/* Dotted Perforation Line */}
            <div className="w-full flex items-center justify-between opacity-50 select-none">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className="h-[1.5px] w-1.5 bg-slate-300 rounded-xs"
                />
              ))}
            </div>
          </div>

          {/* Right: Dim Status Pip */}
          <div className="shrink-0 flex items-center justify-center">
            <span className="h-4 w-1.5 rounded-full bg-slate-700/70 border-t border-white/10" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXPANDING RECEIPT CONTAINER (Automatically Pushes Controls Down)       */}
      {/* ========================================================================= */}
      <div
        key={feedKey}
        className={`relative z-20 -mt-6 grid transition-all duration-500 ${
          isDispensed ? "animate-dispenser-expand" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden pt-6 pb-2">
          <div
            className={`receipt-serrated-top mx-auto w-full max-w-[420px] bg-[#FCFAF5] text-ink-900 shadow-[0_25px_50px_rgba(15,23,42,0.18)] border-x border-b border-ink-900/15 ${
              isDispensed ? "animate-paper-slide" : ""
            }`}
            style={{
              filter: "drop-shadow(0 14px 24px rgba(0,0,0,0.14))",
            }}
          >
            {/* Thermal Paper Interior Content */}
            <div className="p-6 sm:p-7 pt-8">
              
              {/* Receipt Header / Original Merchant Logo */}
              <div className="text-center pb-5 border-b-2 border-dashed border-ink-900/20">
                <div className="flex justify-center mb-2">
                  <CashFlowMark className="h-9 w-9" />
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-ink-900">
                  CASH FLOW MASTERY
                </h3>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-600 mt-0.5">
                  Independent Advisors FZE
                </p>
                <p className="font-mono text-[9.5px] text-ink-500 mt-0.5">
                  Sharjah Publishing City Free Zone, Sharjah, UAE
                </p>
                <p className="font-mono text-[9.5px] text-ink-500">
                  support@independentadvisors.ai · 0% UAE Free Zone VAT
                </p>

                <div className="mt-3 inline-block rounded-xs bg-ink-900 px-2.5 py-0.5 text-paper-100 font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                  ★ OFFICIAL ADMISSION RECEIPT ★
                </div>
              </div>

              {/* Metadata Grid */}
              <div className="py-4 border-b-2 border-dashed border-ink-900/20 font-mono text-[11.5px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ink-500 uppercase">ORDER ID:</span>
                  <span className="font-bold text-ink-900">{data.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 uppercase">DATE &amp; TIME:</span>
                  <span className="text-ink-900 font-medium">{data.dateFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 uppercase">PARTICIPANT:</span>
                  <span className="font-bold text-ink-900 truncate max-w-[200px] text-right">
                    {data.name || "Executive Attendee"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 uppercase">EMAIL:</span>
                  <span className="text-ink-800 truncate max-w-[200px] text-right">
                    {data.email || "Confidential"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 uppercase">PLACE ALLOCATION:</span>
                  <span className="font-bold text-gold-700">
                    {data.seatNumber ? `SEAT #${data.seatNumber} OF 15` : "FOUNDING PLACE RESERVED"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-500 uppercase">PAYMENT:</span>
                  <span className="text-ink-900">Stripe Card Verified</span>
                </div>
              </div>

              {/* Itemized Inclusions */}
              <div className="py-4 border-b-2 border-dashed border-ink-900/20">
                <div className="flex justify-between font-mono text-[10.5px] font-bold uppercase text-ink-600 pb-1.5 border-b border-ink-900/10">
                  <span>ITEM / INCLUSIONS</span>
                  <span>AMOUNT</span>
                </div>

                <div className="mt-2.5">
                  <div className="flex justify-between items-start font-mono text-xs">
                    <div>
                      <p className="font-bold text-ink-900 text-[13px]">
                        {data.tierName}
                      </p>
                      <p className="text-ink-600 text-[10.5px]">
                        4-Week Executive Cash Visibility Programme
                      </p>
                    </div>
                    <span className="font-bold text-ink-900 text-sm">
                      {data.amountFormatted}
                    </span>
                  </div>

                  <ul className="mt-2 space-y-1 font-mono text-[10px] text-ink-600 pl-1">
                    <li>• 4x Live Clinics with Carl Lewis (60–75 min)</li>
                    <li>• 13-Week Cash-Flow Forecast Spreadsheet Model</li>
                    <li>• Executive Cash Visibility Diagnostic Toolkit</li>
                    <li>• 12-Month On-Demand Video Replays &amp; Portal Access</li>
                  </ul>
                </div>
              </div>

              {/* Financial Totals */}
              <div className="py-4 border-b-2 border-dashed border-ink-900/20 font-mono text-xs space-y-1.5">
                <div className="flex justify-between text-ink-600">
                  <span>SUBTOTAL</span>
                  <span>{data.amountFormatted}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>TAX / UAE VAT (0% FREE ZONE)</span>
                  <span>$0.00 USD</span>
                </div>
                <div className="pt-2 border-t-2 border-ink-900 flex justify-between items-baseline font-mono">
                  <span className="text-sm font-bold uppercase tracking-wider text-ink-900">
                    TOTAL PAID:
                  </span>
                  <span className="font-display text-2xl font-bold text-ink-900">
                    {data.amountFormatted} <span className="text-xs font-mono font-normal">USD</span>
                  </span>
                </div>
              </div>

              {/* Guarantees & Terms Notice */}
              <div className="py-3 text-center font-mono text-[9.5px] text-ink-500 leading-relaxed">
                <p>7-Day Money-Back Guarantee Protected prior to cohort start.</p>
                <p>All sales subject to Independent Advisors FZE Course Terms of Sale.</p>
              </div>

              {/* Scannable SVG Barcode */}
              <div className="pt-2 text-center">
                <div className="flex justify-center items-center gap-[2px] h-10 opacity-90 mx-auto max-w-xs" aria-hidden="true">
                  {[
                    3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4,
                    2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 2, 1, 3,
                    2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3
                  ].map((w, idx) => (
                    <span
                      key={idx}
                      className="h-full bg-ink-900"
                      style={{ width: `${w * 1.3}px` }}
                    />
                  ))}
                </div>
                <p className="mt-1 font-mono text-[9.5px] tracking-[0.25em] text-ink-700 font-bold uppercase">
                  *{data.orderId}-{data.sessionReference.slice(-6).toUpperCase()}*
                </p>
                <p className="mt-0.5 font-mono text-[8.5px] uppercase tracking-wider text-ink-400">
                  THANK YOU FOR YOUR ENROLMENT
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. STATUS & BUTTONS (AUTOMATICALLY PUSHED DOWN AS PAPER DISPENSES)        */}
      {/* ========================================================================= */}
      <div className="mt-6 text-center transition-all duration-300">
        <h4 className="font-display text-lg font-semibold text-ink-900 tracking-tight">
          {isPrinting ? "Printing Receipt..." : "Receipt Cut & Torn"}
        </h4>
        <p className="font-sans text-xs text-ink-500 mt-0.5">
          Ready to print a fresh copy anytime.
        </p>

        {/* Buttons: [ 🖨️ Print receipt ] and [ 📋 Copy ] */}
        <div className="mt-4 flex items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={triggerPrint}
            disabled={isPrinting}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-900/15 bg-paper-50/90 px-4 py-2 font-sans text-sm font-medium text-ink-900 shadow-sm hover:bg-white hover:border-ink-900/30 hover:shadow transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {/* Clean Printer SVG Icon */}
            <svg
              className="h-4 w-4 text-ink-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            <span>{isPrinting ? "Printing..." : "Print receipt"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-900/15 bg-paper-50/90 px-4 py-2 font-sans text-sm font-medium text-ink-900 shadow-sm hover:bg-white hover:border-ink-900/30 hover:shadow transition-all active:scale-[0.98] cursor-pointer"
          >
            {/* Clean Copy SVG Icon */}
            <svg
              className="h-4 w-4 text-ink-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>

        {/* Extra Action Links (Calendar & WhatsApp) */}
        <div className="mt-4 text-center font-mono text-xs print:hidden space-x-4">
          <button
            type="button"
            onClick={handleBrowserPrint}
            className="text-ink-600 hover:text-ink-900 underline underline-offset-4 font-semibold cursor-pointer"
          >
            Save as PDF / Print
          </button>
          <span className="text-ink-300">·</span>
          <a
            href={makeCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-700 hover:text-gold-600 underline underline-offset-4 font-semibold"
          >
            Add to Google Calendar
          </a>
          <span className="text-ink-300">·</span>
          <a
            href={whatsappUrl(`Hi Carl — I have just completed payment for ${site.name} (Ref: ${data.orderId}).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:text-emerald-600 underline underline-offset-4 font-semibold"
          >
            WhatsApp Carl
          </a>
        </div>
      </div>

    </div>
  );
}
