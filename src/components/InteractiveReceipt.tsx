"use client";

import { useState, useEffect } from "react";
import CashFlowMark from "./CashFlowMark";
import { site, carl, cohort, contact, whatsappUrl } from "@/content/course";

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
  const [isPrinting, setIsPrinting] = useState(true);
  const [printKey, setPrintKey] = useState(0);

  useEffect(() => {
    // Reset printing state on load
    setIsPrinting(true);
    const timer = setTimeout(() => setIsPrinting(false), 2400);
    return () => clearTimeout(timer);
  }, [printKey]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReFeed = () => {
    setPrintKey((k) => k + 1);
  };

  const makeCalendarUrl = () => {
    const title = encodeURIComponent(`${site.name} — Live Cohort Session`);
    const details = encodeURIComponent(
      `Official Registration for Cash Flow Mastery.\nTaught by ${carl.name}, ${carl.credentials}.\nOrder ID: ${data.orderId}\nLive clinic dates and links will be dispatched via email before week 1.`
    );
    const location = encodeURIComponent("Online Live Clinic (GST / UTC+4)");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="my-10 w-full max-w-2xl mx-auto font-sans">
      <style jsx global>{`
        @keyframes thermalPrintFeed {
          0% {
            transform: translateY(-92%);
            opacity: 0.3;
          }
          10% {
            transform: translateY(-90%);
            opacity: 1;
          }
          22% {
            transform: translateY(-75%);
          }
          26% {
            transform: translateY(-75%);
          }
          40% {
            transform: translateY(-56%);
          }
          45% {
            transform: translateY(-56%);
          }
          60% {
            transform: translateY(-38%);
          }
          65% {
            transform: translateY(-38%);
          }
          78% {
            transform: translateY(-18%);
          }
          83% {
            transform: translateY(-18%);
          }
          95% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(0%);
            opacity: 1;
          }
        }
        .animate-thermal-print {
          animation: thermalPrintFeed 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
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
      {/* 1. DARK-MODE CARD CONTAINER WITH "ORDER COMPLETE" STATUS                  */}
      {/* ========================================================================= */}
      <div className="rounded-xl border border-ink-700/60 bg-gradient-to-b from-ink-900 via-ink-900 to-ink-950 p-6 sm:p-8 text-paper-100 shadow-[0_25px_70px_-15px_rgba(5,14,36,0.6)]">
        
        {/* Status Header with Checkmark */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-paper-100/10">
          <div className="flex items-center gap-3.5">
            {/* Animated Checkmark Badge */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)]">
              <svg
                className="h-6 w-6 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-emerald-400 font-bold">
                  Payment Verified
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-paper-100 font-bold tracking-tight">
                Order complete
              </h2>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex items-center gap-2 print:hidden self-start sm:self-center">
            <button
              type="button"
              onClick={handleReFeed}
              title="Re-run receipt printing animation"
              className="inline-flex items-center gap-1.5 rounded-md border border-paper-100/20 bg-ink-800/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-paper-300 hover:bg-ink-700 hover:text-paper-100 transition-all"
            >
              <span>↺ Re-feed</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-md border border-paper-100/20 bg-ink-800/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-paper-300 hover:bg-ink-700 hover:text-paper-100 transition-all"
            >
              <span>{copied ? "✓ Copied" : "📋 Copy ID"}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-md border border-gold-500/50 bg-gold-500/20 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-gold-300 hover:bg-gold-500 hover:text-ink-950 transition-all shadow-sm"
            >
              <span>🖨️ Print / PDF</span>
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2. THE SKEUOMORPHIC PRINTER SLOT (Physical Mouth of Printer)            */}
        {/* ======================================================================= */}
        <div className="mt-7">
          <div className="text-center mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper-300/40">
              ▼ THERMAL RECEIPT DISPENSER ▼
            </span>
          </div>

          {/* Printer Faceplate Housing */}
          <div className="relative mx-auto rounded-t-lg bg-gradient-to-b from-ink-950 to-black p-2 border-t border-x border-ink-700/80 shadow-inner">
            {/* Metallic Slot Slit with deep shadows */}
            <div className="relative h-3 w-full rounded-sm bg-black shadow-[inset_0_3px_8px_rgba(0,0,0,1)] border-b border-paper-100/10 flex items-center justify-between px-3">
              <span className="h-1 w-2 rounded-full bg-emerald-500/60 shadow-[0_0_6px_#10b981]" />
              <span className="h-1 w-2 rounded-full bg-paper-100/20" />
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 3. THE PRINTING RECEIPT (Crisp Thermal Paper with Serrated Top)       */}
          {/* ===================================================================== */}
          <div className="relative overflow-hidden pt-0.5 pb-6">
            <div
              key={printKey}
              className="animate-thermal-print receipt-serrated-top mx-auto w-full bg-[#FCFAF5] text-ink-900 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-x border-b border-ink-700/20"
              style={{
                filter: "drop-shadow(0 15px 25px rgba(0,0,0,0.25))",
              }}
            >
              {/* Thermal Paper Interior Padding */}
              <div className="p-6 sm:p-9 pt-8">
                
                {/* Receipt Header / Merchant Info */}
                <div className="text-center pb-6 border-b-2 border-dashed border-ink-900/20">
                  <div className="flex justify-center mb-2.5">
                    <CashFlowMark className="h-10 w-10" />
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-ink-900">
                    CASH FLOW MASTERY
                  </h3>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-600 mt-0.5">
                    Independent Advisors FZE
                  </p>
                  <p className="font-mono text-[10px] text-ink-500 mt-0.5">
                    Sharjah Publishing City Free Zone, Sharjah, UAE
                  </p>
                  <p className="font-mono text-[10px] text-ink-500">
                    support@independentadvisors.ai · VAT ID: 0% Free Zone Exempt
                  </p>

                  <div className="mt-4 inline-block rounded-xs bg-ink-900 px-3 py-1 text-paper-100 font-mono text-[10.5px] font-bold uppercase tracking-[0.16em]">
                    ★ OFFICIAL ADMISSION RECEIPT ★
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="py-5 border-b-2 border-dashed border-ink-900/20 font-mono text-xs space-y-2">
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
                    <span className="font-bold text-ink-900 truncate max-w-[240px] text-right">
                      {data.name || "Executive Attendee"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500 uppercase">EMAIL:</span>
                    <span className="text-ink-800 truncate max-w-[240px] text-right">
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
                    <span className="text-ink-500 uppercase">PAYMENT METHOD:</span>
                    <span className="text-ink-900">Stripe Card Payment (Verified)</span>
                  </div>
                </div>

                {/* Itemized Breakdown Table */}
                <div className="py-5 border-b-2 border-dashed border-ink-900/20">
                  <div className="flex justify-between font-mono text-[11px] font-bold uppercase text-ink-600 pb-2 border-b border-ink-900/10">
                    <span>ITEM / INCLUSIONS</span>
                    <span>AMOUNT</span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between items-start font-mono text-xs">
                      <div>
                        <p className="font-bold text-ink-900 text-sm">
                          {data.tierName}
                        </p>
                        <p className="text-ink-600 text-[11px]">
                          4-Week Executive Cash Visibility Programme
                        </p>
                      </div>
                      <span className="font-bold text-ink-900 text-sm">
                        {data.amountFormatted}
                      </span>
                    </div>

                    <ul className="mt-2.5 space-y-1 font-mono text-[10.5px] text-ink-600 pl-2">
                      <li>• 4x Live Clinics with Carl Lewis (60–75 min)</li>
                      <li>• 13-Week Cash-Flow Forecast Spreadsheet Model</li>
                      <li>• Executive Cash Visibility Diagnostic Toolkit</li>
                      <li>• 12-Month On-Demand Video Replays &amp; Portal Access</li>
                    </ul>
                  </div>
                </div>

                {/* Financial Totals Calculation */}
                <div className="py-5 border-b-2 border-dashed border-ink-900/20 font-mono text-xs space-y-2">
                  <div className="flex justify-between text-ink-600">
                    <span>SUBTOTAL</span>
                    <span>{data.amountFormatted}</span>
                  </div>
                  <div className="flex justify-between text-ink-600">
                    <span>TAX / UAE VAT (0% FREE ZONE)</span>
                    <span>$0.00 USD</span>
                  </div>
                  <div className="pt-2 border-t-2 border-ink-900 flex justify-between items-baseline font-mono">
                    <span className="text-base font-bold uppercase tracking-wider text-ink-900">
                      TOTAL PAID:
                    </span>
                    <span className="font-display text-2xl sm:text-3xl font-bold text-ink-900">
                      {data.amountFormatted} <span className="text-xs font-mono font-normal">USD</span>
                    </span>
                  </div>
                </div>

                {/* Guarantees & Terms Notice */}
                <div className="py-4 text-center font-mono text-[10px] text-ink-500 leading-relaxed">
                  <p>7-Day Money-Back Guarantee Protected prior to cohort start.</p>
                  <p>All sales subject to Independent Advisors FZE Course Terms of Sale.</p>
                </div>

                {/* Scannable SVG Barcode & Auth Code */}
                <div className="pt-3 text-center">
                  <div className="flex justify-center items-center gap-[2px] h-11 opacity-90 mx-auto max-w-sm" aria-hidden="true">
                    {[
                      3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4,
                      2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 2, 1, 3,
                      2, 4, 1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3
                    ].map((w, idx) => (
                      <span
                        key={idx}
                        className="h-full bg-ink-900"
                        style={{ width: `${w * 1.4}px` }}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] tracking-[0.3em] text-ink-700 font-bold uppercase">
                    *{data.orderId}-{data.sessionReference.slice(-6).toUpperCase()}*
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-ink-400">
                    THANK YOU FOR YOUR ENROLMENT
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footer Quick CTA Integration */}
        <div className="mt-4 pt-4 border-t border-paper-100/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs print:hidden">
          <span className="text-paper-300/70">
            Need calendar invites or onboarding assistance?
          </span>
          <div className="flex items-center gap-3">
            <a
              href={makeCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wider underline underline-offset-4"
            >
              📅 Add to Calendar →
            </a>
            <a
              href={whatsappUrl(`Hi Carl — I have just completed payment for ${site.name} (Ref: ${data.orderId}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider underline underline-offset-4"
            >
              💬 WhatsApp Carl →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
