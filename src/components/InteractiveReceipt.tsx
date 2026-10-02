"use client";

import { useState } from "react";
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

  const makeCalendarUrl = () => {
    const title = encodeURIComponent(`${site.name} — Live Cohort Session`);
    const details = encodeURIComponent(
      `Official Registration for Cash Flow Mastery.\nTaught by ${carl.name}, ${carl.credentials}.\nOrder ID: ${data.orderId}\nLive session details and links will be emailed before week 1.`
    );
    const location = encodeURIComponent("Online Live Clinic");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <div className="my-12">
      {/* Top Banner & Quick Actions */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-gold-700">
            Official Enrolment Certificate &amp; Payment Receipt
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 print:hidden">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-xs border-2 border-ink-700/20 bg-paper-50 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink-900 shadow-sm transition-all hover:border-ink-900 hover:bg-paper-100 hover:-translate-y-0.5"
          >
            <span>{copied ? "✓ Copied!" : "📋 Copy ID"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xs border-2 border-gold-600 bg-gold-500 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.14em] text-ink-950 shadow-sm transition-all hover:bg-gold-400 hover:border-gold-500 hover:-translate-y-0.5"
          >
            <span>🖨️ Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Luxury Ticket & Receipt Container */}
      <div className="relative overflow-hidden rounded-xs border-2 border-gold-600/60 bg-paper-50 shadow-[0_30px_90px_-20px_rgba(5,14,36,0.3)] print:border-ink-900 print:shadow-none">
        
        {/* ========================================================================= */}
        {/* TOP PASS SECTION (Dark Navy & Luxury Gold)                                */}
        {/* ========================================================================= */}
        <div className="relative bg-ink-900 p-6 sm:p-10 text-paper-100 border-b-2 border-gold-600/40">
          
          {/* Subtle gold grid watermark */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #e8bc6c 1px, transparent 1px), linear-gradient(to bottom, #e8bc6c 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Top Brand & Status Row */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-paper-100/15 pb-8">
            <div className="flex items-center gap-4">
              <CashFlowMark className="h-14 w-14 shrink-0" />
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-3xl sm:text-4xl tracking-tight text-paper-100">
                    Cash Flow
                  </span>
                  <span className="font-display text-3xl sm:text-4xl italic text-gold-400">
                    Mastery
                  </span>
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-gold-400/90 font-medium">
                  Independent Advisors FZE · Sharjah Publishing City Free Zone, UAE
                </p>
              </div>
            </div>

            <div className="flex flex-col md:items-end gap-2 shrink-0">
              <span className="inline-flex items-center gap-2 rounded-xs border-2 border-emerald-400/70 bg-emerald-500/20 px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                VERIFIED ADMISSION
              </span>
              <span className="font-mono text-xs text-paper-300/80">
                Order Reference: <strong className="text-paper-100">{data.orderId}</strong>
              </span>
            </div>
          </div>

          {/* Key Prominent Stats / Highlights Grid */}
          <div className="relative z-10 mt-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Amount Paid Block */}
            <div className="rounded-xs border border-gold-500/30 bg-ink-800/80 p-4 sm:p-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold-400 font-bold">
                Total Amount Paid
              </p>
              <p className="mt-2 font-display text-3xl sm:text-4xl text-paper-100 font-bold">
                {data.amountFormatted}
              </p>
              <span className="mt-1 inline-block rounded-xs bg-gold-500/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-gold-300 font-semibold">
                {data.currency} · Fully Settled
              </span>
            </div>

            {/* Place Allocation Block */}
            <div className="rounded-xs border border-gold-500/30 bg-ink-800/80 p-4 sm:p-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold-400 font-bold">
                Place Allocation
              </p>
              <p className="mt-2 font-display text-3xl sm:text-4xl text-gold-400 font-bold">
                {data.seatNumber ? `#${data.seatNumber} of 15` : "Seat Confirmed"}
              </p>
              <span className="mt-1 inline-block rounded-xs bg-ink-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-paper-300/80">
                Strict 15-Cap Cohort
              </span>
            </div>

            {/* Participant Block */}
            <div className="rounded-xs border border-paper-100/10 bg-ink-800/80 p-4 sm:p-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-paper-300/70">
                Registered Attendee
              </p>
              <p className="mt-2 font-display text-xl text-paper-100 font-bold truncate">
                {data.name || "Executive Participant"}
              </p>
              <p className="mt-1 font-mono text-xs text-paper-300/80 truncate">
                {data.email || "Confidential"}
              </p>
            </div>

            {/* Issue Date & Program */}
            <div className="rounded-xs border border-paper-100/10 bg-ink-800/80 p-4 sm:p-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-paper-300/70">
                Cohort Schedule
              </p>
              <p className="mt-2 font-display text-xl text-paper-100 font-bold">
                {cohort.durationWeeks} Weeks Blended
              </p>
              <p className="mt-1 font-mono text-xs text-gold-400 font-medium">
                {cohort.liveSession.timezone}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PERFORATED TEAR-OFF NOTCH STRIP                                           */}
        {/* ========================================================================= */}
        <div className="relative h-6 bg-paper-100 flex items-center justify-between overflow-hidden border-y border-ink-700/10">
          {/* Left semi-circle cut out */}
          <div className="h-6 w-3 rounded-r-full bg-paper-200 border-r border-ink-700/20" />
          
          {/* Dashed tear line with scissor label */}
          <div className="flex-1 mx-4 flex items-center justify-center gap-3">
            <span className="h-px flex-1 border-b-2 border-dashed border-ink-700/25" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400 flex items-center gap-1.5 shrink-0">
              <span>✂</span>
              <span>Official Tax Receipt &amp; Curriculum Pass</span>
            </span>
            <span className="h-px flex-1 border-b-2 border-dashed border-ink-700/25" />
          </div>

          {/* Right semi-circle cut out */}
          <div className="h-6 w-3 rounded-l-full bg-paper-200 border-l border-ink-700/20" />
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM RECEIPT SECTION (High-Contrast Ivory Paper & Dark Ink)              */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-10 bg-paper-50 text-ink-900">
          
          <h3 className="font-display text-2xl text-ink-900 font-bold">
            Executive Inclusions &amp; Tax Statement
          </h3>
          <p className="mt-1 text-[15px] text-ink-500">
            Payment processed securely by Stripe. Issued under UAE Commercial Law and SPC Free Zone regulations.
          </p>

          {/* Line Item Table */}
          <div className="mt-6 overflow-hidden rounded-xs border-2 border-ink-700/15 bg-paper-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-ink-700/15 bg-paper-200 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-700">
                  <th className="py-3.5 px-4 sm:px-6">Description</th>
                  <th className="py-3.5 px-4 text-center sm:w-28">Qty</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right sm:w-36">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-700/10 font-mono text-xs">
                <tr>
                  <td className="py-5 px-4 sm:px-6">
                    <p className="font-display text-lg text-ink-900 font-bold">
                      {site.name} — {data.tierName}
                    </p>
                    <p className="mt-1 text-ink-600 font-sans text-sm">
                      Complete 4-Week Live Cohort Programme for SME Owners &amp; Directors.
                    </p>
                    <ul className="mt-3 space-y-1.5 text-ink-700 font-sans text-xs">
                      <li className="flex items-center gap-2">
                        <span className="text-gold-700 font-bold">✓</span>
                        <span><strong>4 Live Interactive Clinics</strong> with Carl Lewis, MBA, FCMA, CGMA (60–75 min each)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gold-700 font-bold">✓</span>
                        <span><strong>Proprietary 13-Week Cash Forecast Model</strong> (Excel &amp; Google Sheets master templates)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gold-700 font-bold">✓</span>
                        <span><strong>Executive Cash Visibility Diagnostic</strong> baseline assessment and audit exercises</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-gold-700 font-bold">✓</span>
                        <span><strong>12-Month Unlimited Portal Access</strong> including high-definition recordings of all sessions</span>
                      </li>
                    </ul>
                  </td>
                  <td className="py-5 px-4 text-center font-bold text-ink-900 align-top text-sm">
                    1 Seat
                  </td>
                  <td className="py-5 px-4 sm:px-6 text-right font-bold text-ink-900 align-top text-lg font-display">
                    {data.amountFormatted}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-ink-700/15 bg-paper-100 font-mono text-xs">
                  <td colSpan={2} className="py-3 px-4 sm:px-6 text-right text-ink-600 uppercase tracking-wider">
                    Subtotal:
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right font-bold text-ink-900">
                    {data.amountFormatted}
                  </td>
                </tr>
                <tr className="bg-paper-100 font-mono text-xs">
                  <td colSpan={2} className="py-2 px-4 sm:px-6 text-right text-ink-600 uppercase tracking-wider">
                    UAE VAT / Tax (0% Free Zone Exempt):
                  </td>
                  <td className="py-2 px-4 sm:px-6 text-right text-ink-900">
                    $0.00 USD
                  </td>
                </tr>
                <tr className="border-t-2 border-ink-900 bg-ink-900 text-paper-100 font-mono">
                  <td colSpan={2} className="py-4 px-4 sm:px-6 text-right font-bold uppercase tracking-[0.16em] text-gold-400">
                    Total Amount Paid:
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right font-display text-2xl font-bold text-gold-400">
                    {data.amountFormatted} <span className="text-xs font-mono font-normal text-paper-300">USD</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Guarantee & Calendar CTA Row */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 rounded-xs border-2 border-gold-600/30 bg-gold-500/10 p-5 sm:p-6">
            <div className="flex items-start gap-3.5">
              <span className="text-2xl">🛡️</span>
              <div>
                <h4 className="font-display text-base text-ink-900 font-bold">
                  7-Day Money-Back Guarantee Protected
                </h4>
                <p className="mt-0.5 text-xs text-ink-600 leading-relaxed">
                  Full 100% refund available up to 7 calendar days before the cohort start date per our published Terms of Sale.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 print:hidden">
              <a
                href={makeCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xs border border-ink-900 bg-ink-900 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-paper-100 shadow-sm transition-all hover:bg-ink-800 hover:-translate-y-0.5"
              >
                <span>📅 Add to Calendar</span>
              </a>
              <a
                href={whatsappUrl(`Hi Carl — I have just registered for ${site.name} (Ref: ${data.orderId}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xs border border-emerald-700 bg-emerald-600 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-all hover:bg-emerald-500 hover:-translate-y-0.5"
              >
                <span>💬 WhatsApp Carl</span>
              </a>
            </div>
          </div>

          {/* Legal Stamp & Barcode Footer */}
          <div className="mt-8 pt-6 border-t border-ink-700/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 font-mono text-[11px] text-ink-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 h-8 opacity-75" aria-hidden="true">
                {[4, 2, 5, 2, 6, 3, 2, 5, 2, 4, 3, 5, 2, 6, 2, 4, 3, 5, 2, 6, 3, 2, 5].map((w, i) => (
                  <span key={i} className="h-full bg-ink-900" style={{ width: `${w}px` }} />
                ))}
              </div>
              <div>
                <p className="font-bold text-ink-900 tracking-wider">
                  AUTH CODE: {data.sessionReference.toUpperCase()}
                </p>
                <p className="text-[10px] text-ink-400">
                  Transaction Verified · Independent Advisors FZE
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-ink-700">Support: <a href={`mailto:${contact.email}`} className="text-gold-700 underline font-medium">{contact.email}</a></p>
              <p className="text-[10px] text-ink-400 mt-0.5">Sharjah Publishing City Free Zone, UAE</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
