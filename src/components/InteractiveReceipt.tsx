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
  const [hasPrinted, setHasPrinted] = useState(true);
  const [feedKey, setFeedKey] = useState(0);

  // Automatically trigger feed animation on initial load
  useEffect(() => {
    setIsPrinting(true);
    const timer = setTimeout(() => {
      setIsPrinting(false);
      setHasPrinted(true);
    }, 2200);
    return () => clearTimeout(timer);
  }, [feedKey]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleTriggerPrint = () => {
    // If user clicks "Print receipt", trigger the mechanical dispenser feed animation
    setIsPrinting(true);
    setFeedKey((k) => k + 1);
  };

  const handleSystemPrint = () => {
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
        @keyframes thermalPrintFeed {
          0% {
            transform: translateY(-92%);
            opacity: 0.2;
          }
          12% {
            transform: translateY(-88%);
            opacity: 1;
          }
          24% {
            transform: translateY(-72%);
          }
          30% {
            transform: translateY(-72%);
          }
          44% {
            transform: translateY(-52%);
          }
          50% {
            transform: translateY(-52%);
          }
          64% {
            transform: translateY(-34%);
          }
          70% {
            transform: translateY(-34%);
          }
          84% {
            transform: translateY(-16%);
          }
          90% {
            transform: translateY(-16%);
          }
          98% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }
        .animate-thermal-print {
          animation: thermalPrintFeed 2.2s cubic-bezier(0.2, 0.9, 0.4, 1) forwards;
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

      {/* ========================================================================= */}
      {/* 1. ADVANCE RECEIPT PRINT HEADER & CONTROLS (Matching Image Layout)        */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center text-center mb-6">
        <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink-900">
          Advance Receipt Print
        </h3>
      </div>

      {/* ========================================================================= */}
      {/* 2. SKEUOMORPHIC 3D PILL PRINTER DISPENSER BAR                             */}
      {/* ========================================================================= */}
      <div className="relative mx-auto w-full max-w-[440px] z-20">
        {/* 3D Dispenser Outer Shell */}
        <div className="relative h-14 sm:h-16 w-full rounded-2xl sm:rounded-full bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#020617] p-2 shadow-[0_18px_38px_-10px_rgba(2,6,23,0.65),0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] border border-slate-700/50 flex items-center justify-center">
          
          {/* Top Edge Gloss Highlight */}
          <div className="absolute top-1.5 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full pointer-events-none" />

          {/* Recessed Thermal Slot Slit */}
          <div className="relative h-3 w-[88%] rounded-sm bg-black/95 shadow-[inset_0_2px_6px_rgba(0,0,0,1)] border-t border-black border-b border-white/10 flex items-center justify-between px-3">
            {/* Dot Matrix Slit Perforations */}
            <div className="w-full flex items-center justify-center gap-1.5 opacity-60 overflow-hidden">
              {Array.from({ length: 32 }).map((_, i) => (
                <span
                  key={i}
                  className="h-[2px] w-[3px] rounded-full bg-slate-400 shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Left / Right Subtle Side Accents */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-1 rounded-full bg-emerald-500/70 shadow-[0_0_8px_#10b981]" />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-1 rounded-full bg-slate-600/40" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. RECEIPT STATUS & ACTION BUTTONS                                        */}
      {/* ========================================================================= */}
      <div className="mt-5 mb-6 text-center">
        <h4 className="font-display text-lg font-semibold text-ink-900 tracking-tight">
          {isPrinting ? "Printing Receipt..." : "Receipt Cut &amp; Torn"}
        </h4>
        <p className="font-sans text-xs text-ink-500 mt-0.5">
          Ready to print a fresh copy anytime.
        </p>

        {/* Buttons: [ Print receipt ] and [ Copy ] */}
        <div className="mt-4 flex items-center justify-center gap-3 print:hidden">
          <button
            type="button"
            onClick={handleTriggerPrint}
            disabled={isPrinting}
            className="inline-flex items-center gap-2 rounded-xl border border-ink-900/15 bg-paper-50/90 px-4 py-2 font-sans text-sm font-medium text-ink-900 shadow-sm hover:bg-white hover:border-ink-900/30 hover:shadow transition-all active:scale-[0.98] disabled:opacity-60"
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
            className="inline-flex items-center gap-2 rounded-xl border border-ink-900/15 bg-paper-50/90 px-4 py-2 font-sans text-sm font-medium text-ink-900 shadow-sm hover:bg-white hover:border-ink-900/30 hover:shadow transition-all active:scale-[0.98]"
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
      </div>

      {/* ========================================================================= */}
      {/* 4. THE THERMAL RECEIPT DISPENSING DOWNWARDS FROM THE SLOT                 */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden pt-1 pb-4">
        <div
          key={feedKey}
          className="animate-thermal-print receipt-serrated-top mx-auto w-full max-w-[420px] bg-[#FCFAF5] text-ink-900 shadow-[0_20px_45px_rgba(15,23,42,0.18)] border-x border-b border-ink-900/15"
          style={{
            filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.12))",
          }}
        >
          {/* Thermal Paper Interior Content */}
          <div className="p-6 sm:p-7 pt-7">
            
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

      {/* Extra Action Links (Calendar & WhatsApp) */}
      <div className="mt-2 text-center font-mono text-xs print:hidden space-x-4">
        <button
          type="button"
          onClick={handleSystemPrint}
          className="text-ink-600 hover:text-ink-900 underline underline-offset-4 font-semibold"
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
  );
}
