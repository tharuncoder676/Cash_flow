"use client";

import { useState } from "react";
import CashFlowMark from "./CashFlowMark";
import IndependentAdvisorsLogo from "./IndependentAdvisorsLogo";
import { site, carl, cohort } from "@/content/course";

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
  const [flipped, setFlipped] = useState(false);

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

  // Generate Google Calendar link
  const makeCalendarUrl = () => {
    const title = encodeURIComponent(`${site.name} — Live Cohort Session`);
    const details = encodeURIComponent(
      `Welcome to Cash Flow Mastery by Independent Advisors.\nTaught by ${carl.name}, ${carl.credentials}.\nReceipt Order: ${data.orderId}`
    );
    const location = encodeURIComponent("Online Live Clinic (Link sent via email)");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="my-10">
      {/* Action Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
        <span className="flex items-center gap-2 text-gold-700">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Official Payment Receipt &amp; Member Pass
        </span>
        <div className="flex items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xs border border-ink-700/20 bg-paper-50 px-3 py-1.5 text-ink-700 hover:border-ink-700 hover:text-ink-900 transition-all shadow-xs"
          >
            <span>{copied ? "✓ Copied" : "Copy ID"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xs border border-gold-600/30 bg-gold-500/10 px-3 py-1.5 text-gold-700 hover:bg-gold-500/20 hover:border-gold-600 transition-all shadow-xs"
          >
            <span>🖨️ Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Luxury Digital Ticket / Receipt Card */}
      <div
        className="relative overflow-hidden rounded-xs border-2 border-gold-600/40 bg-gradient-to-b from-ink-900 via-ink-900 to-ink-950 text-paper-100 shadow-[0_25px_60px_-15px_rgba(5,14,36,0.35)]"
      >
        {/* Subtle decorative security background watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #e8bc6c 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Gold thread accent rail */}
        <div className="h-1.5 w-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

        <div className="p-6 sm:p-9 relative z-10">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b border-paper-100/10 pb-7">
            <div className="flex items-center gap-3.5">
              <CashFlowMark className="h-11 w-11" />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl tracking-[-0.01em] text-paper-100">
                    Cash Flow
                  </span>
                  <span className="font-display text-2xl italic text-gold-400">
                    Mastery
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-paper-300/60">
                    Executive Programme
                  </span>
                  <span className="text-paper-300/40">·</span>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-gold-400">
                    Independent Advisors FZE
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end font-mono">
              <span className="inline-flex items-center gap-1.5 rounded-xs border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.14em] text-emerald-400 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                PAID &amp; CONFIRMED
              </span>
              <span className="mt-2 text-[11px] text-paper-300/65">
                Ref: {data.orderId}
              </span>
            </div>
          </div>

          {/* Member & Pass Information Grid */}
          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 border-b border-paper-100/10 pb-7">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-500/80">
                Participant
              </p>
              <p className="mt-1 font-display text-lg text-paper-100 truncate">
                {data.name || "Enrolled Executive"}
              </p>
              <p className="font-mono text-[11px] text-paper-300/65 truncate">
                {data.email || "Confidential"}
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-500/80">
                Cohort Tier
              </p>
              <p className="mt-1 font-display text-lg text-paper-100">
                {data.tierName}
              </p>
              <p className="font-mono text-[11px] text-paper-300/65">
                4-Week Live Executive Cohort
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-500/80">
                Place Allocation
              </p>
              <p className="mt-1 font-display text-lg text-gold-400 font-bold">
                {data.seatNumber ? `Place #${data.seatNumber} of 15` : "Founding Place Reserved"}
              </p>
              <p className="font-mono text-[11px] text-paper-300/65">
                Strict 15-Seat Cap
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-500/80">
                Issue Date
              </p>
              <p className="mt-1 font-display text-lg text-paper-100">
                {data.dateFormatted}
              </p>
              <p className="font-mono text-[11px] text-paper-300/65">
                GST (UTC+4)
              </p>
            </div>
          </div>

          {/* Line Items Breakdown */}
          <div className="mt-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-500/80 mb-3">
              Order Breakdown
            </p>
            <div className="rounded-xs border border-paper-100/8 bg-ink-800/60 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-display text-base text-paper-100">
                    Cash Flow Mastery — Founding Cohort Place
                  </h4>
                  <ul className="mt-2 space-y-1 font-mono text-[11.5px] text-paper-300/70">
                    <li>• 4x Live 75-min Weekly Clinics with Carl Lewis</li>
                    <li>• Proprietary 13-Week Dynamic Cash Forecast Spreadsheet Model</li>
                    <li>• Executive Cash Visibility Diagnostic Toolkit &amp; Exercises</li>
                    <li>• 12-Month On-Demand Video Replay &amp; Resource Portal Access</li>
                  </ul>
                </div>
                <div className="text-right">
                  <span className="font-display text-xl text-paper-100 font-bold">
                    {data.amountFormatted}
                  </span>
                  <span className="block font-mono text-[10px] text-paper-300/60 uppercase">
                    {data.currency}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-paper-100/10 flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-[11px] text-paper-300/60">
                  <span>Tax / VAT: </span>
                  <span className="text-paper-100">USD 0.00 (Sharjah Free Zone Exempt)</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-gold-400">
                    Total Captured:
                  </span>
                  <span className="font-display text-2xl font-bold text-gold-400">
                    {data.amountFormatted}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Barcode & Authentication Footer */}
          <div className="mt-8 pt-6 border-t border-paper-100/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            {/* Stylized Barcode SVG */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-[2px] h-9 opacity-80" aria-hidden="true">
                {[
                  3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4,
                  2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 2, 1, 3,
                ].map((w, idx) => (
                  <span
                    key={idx}
                    className="h-full bg-gold-400"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] tracking-[0.25em] text-paper-300/50 uppercase">
                AUTH-STAMP // {data.sessionReference.slice(-16)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 print:hidden">
              <a
                href={makeCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xs border border-gold-500/40 bg-gold-500/15 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-gold-300 hover:bg-gold-500/25 hover:text-paper-100 transition-all shadow-sm"
              >
                <span>📅 Add to Google Calendar</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
