"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { contact, whatsappUrl } from "@/content/course";

type Gateway = {
  id: string;
  badge: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  iconType: "chart" | "book" | "compass";
};

const GATEWAYS: Gateway[] = [
  {
    id: "01",
    badge: "Interactive Model",
    title: "13-Week Cash Forecast",
    description: "Explore the live interactive forecast model and see how payment terms alter cash runways.",
    href: "/#why",
    cta: "Launch Cash Model",
    iconType: "chart",
  },
  {
    id: "02",
    badge: "Founding Cohort",
    title: "The 4-Week Programme",
    description: "Review the full curriculum, 4 live sessions with Carl, and the 15-founder seat tier.",
    href: "/course",
    cta: "Explore Curriculum",
    iconType: "book",
  },
  {
    id: "03",
    badge: "Self Assessment",
    title: "Free Cash Diagnostic",
    description: "Answer 5 focused questions to identify where liquidity is bottlenecked in your business.",
    href: "/diagnostic",
    cta: "Take Free Diagnostic",
    iconType: "compass",
  },
];

const SEARCH_DIRECTORY = [
  { title: "Course Curriculum & Overview", href: "/course", tag: "Programme" },
  { title: "Interactive 13-Week Forecast Model", href: "/#why", tag: "Tool" },
  { title: "Free Cash Flow Diagnostic (5-Min)", href: "/diagnostic", tag: "Diagnostic" },
  { title: "Founding Cohort Enrolment & Pricing", href: "/course#enrol", tag: "Enrol" },
  { title: "About Carl & Independent Advisors", href: "/about", tag: "About" },
  { title: "Frequently Asked Questions (FAQs)", href: "/faq", tag: "FAQ" },
  { title: "Terms of Service & Refund Policy", href: "/legal/terms", tag: "Legal" },
  { title: "Privacy Policy", href: "/legal/privacy", tag: "Legal" },
];

export function NotFoundInteractive() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [reconciled, setReconciled] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 14;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.22,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleReconcile = () => {
    if (reconciling) return;
    setReconciling(true);
    setTimeout(() => {
      setReconciled(true);
      setReconciling(false);
    }, 600);
  };

  const filteredLinks = searchQuery.trim()
    ? SEARCH_DIRECTORY.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="relative min-h-[85vh] overflow-hidden bg-paper-200 py-12 lg:py-20 text-ink-900">
      {/* Background Architectural Grid Lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,30,69,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,30,69,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Atmospheric Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[450px] w-[600px] -translate-x-1/2 rounded-full bg-gold-400/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-10 h-[380px] w-[500px] rounded-full bg-ink-700/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
        
        {/* Header Breadcrumb / Code */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-700/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-xs bg-signal-low/10 px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-signal-low border border-signal-low/20">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-low animate-pulse" />
              Status: 404 Unreconciled
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
              Ledger Discrepancy
            </span>
          </div>

          <div className="font-mono text-[11px] text-ink-400 hidden sm:block">
            Ref: <span className="text-ink-700 font-semibold">ERR_ENTRY_OFF_BOOKS</span>
          </div>
        </div>

        {/* Hero Section: 3D Holographic Card & Explanatory Context */}
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          
          {/* Left Column: Typography & Reconcile Controls */}
          <div>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-gold-700">
              Unbalanced Account
            </p>
            <h1 className="mt-3 font-display text-[2.75rem] leading-[1.08] tracking-[-0.03em] text-ink-900 sm:text-[3.5rem] lg:text-[4rem]">
              This page isn’t <br />
              <span className="italic text-gold-600 font-serif">on the books.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-ink-400 sm:text-[18px]">
              The URL you requested has no matching entry in our cash ledger. It may have moved, expired, or been entered with an extra keystroke.
            </p>

            {/* Quick Interactive Reconcile Mechanism */}
            <div className="mt-8 rounded-xs border border-ink-700/15 bg-paper-100/90 p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-gold-700">
                    Ledger Audit Simulation
                  </p>
                  <p className="mt-1 text-sm text-ink-800 font-medium">
                    {reconciled
                      ? "✓ Books rebalanced: Outflow resolved, cash visibility restored."
                      : "Current Variance: -AED 404.00 (Unallocated Resource)"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReconcile}
                  disabled={reconciled || reconciling}
                  className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xs font-mono text-[11px] uppercase tracking-[0.14em] px-4 py-2.5 transition-all duration-300 ${
                    reconciled
                      ? "bg-signal-ok/15 text-signal-ok border border-signal-ok/30 cursor-default"
                      : "bg-ink-700 text-paper-100 hover:bg-ink-900 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                  }`}
                >
                  {reconciling ? (
                    <>
                      <span className="h-2 w-2 animate-spin rounded-full border border-paper-100 border-t-transparent" />
                      Auditing...
                    </>
                  ) : reconciled ? (
                    "✓ Reconciled"
                  ) : (
                    "Rebalance Ledger"
                  )}
                </button>
              </div>

              {/* Progress bar visualizer */}
              <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-700/10">
                <div
                  className={`h-full transition-all duration-700 ease-out ${
                    reconciled ? "w-full bg-signal-ok" : "w-[30%] bg-signal-low"
                  }`}
                />
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xs font-mono text-[12px] font-medium uppercase tracking-[0.14em] bg-ink-700 text-paper-100 px-7 py-3.5 hover:bg-ink-900 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                Return to Solvency (Home)
              </Link>
              <Link
                href="/course"
                className="inline-flex items-center justify-center gap-2 rounded-xs font-mono text-[12px] font-medium uppercase tracking-[0.14em] border border-ink-700/25 text-ink-700 px-6 py-3.5 hover:border-ink-700/60 hover:bg-ink-700/[0.04] transition-all hover:-translate-y-0.5"
              >
                View 4-Week Programme
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Holographic Floating Ledger Card */}
          <div className="flex justify-center perspective-[1200px]">
            <div
              ref={cardRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${
                  isHovered ? "scale3d(1.02, 1.02, 1.02)" : "scale3d(1, 1, 1)"
                }`,
                transition: isHovered ? "transform 0.08s ease-out" : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                transformStyle: "preserve-3d",
              }}
              className="relative w-full max-w-[420px] rounded-xs border border-ink-700/20 bg-ink-900 p-7 sm:p-9 text-paper-100 shadow-[0_30px_70px_-25px_rgba(5,14,36,0.65)] select-none cursor-grab active:cursor-grabbing"
            >
              {/* Dynamic Glare Reflection Overlay */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xs transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(212, 162, 76, 0.35) 0%, transparent 65%)`,
                  opacity: glare.opacity,
                }}
              />

              {/* Hologram Corner Accents */}
              <div className="absolute left-3 top-3 h-2 w-2 border-l-2 border-t-2 border-gold-500/50" />
              <div className="absolute right-3 top-3 h-2 w-2 border-r-2 border-t-2 border-gold-500/50" />
              <div className="absolute bottom-3 left-3 h-2 w-2 border-l-2 border-b-2 border-gold-500/50" />
              <div className="absolute bottom-3 right-3 h-2 w-2 border-r-2 border-b-2 border-gold-500/50" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-paper-100/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-gold-400" />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-paper-300/80">
                    Independent Advisors
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-gold-400/90 border border-gold-400/30 px-2 py-0.5 rounded-xs">
                  VOID DISPATCH
                </span>
              </div>

              {/* Big 3D Typography "404" */}
              <div
                style={{ transform: "translateZ(35px)" }}
                className="my-7 flex flex-col items-center justify-center text-center"
              >
                <div className="relative font-display text-[5.5rem] sm:text-[6.5rem] font-bold leading-none tracking-tight text-paper-100">
                  <span className="bg-gradient-to-b from-paper-100 via-paper-200 to-gold-400 bg-clip-text text-transparent">
                    404
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9.5px] uppercase tracking-[0.3em] text-gold-500 whitespace-nowrap"
                  >
                    ENTRY NOT FOUND
                  </span>
                </div>
              </div>

              {/* Ledger Receipt Mini Table */}
              <div
                style={{ transform: "translateZ(20px)" }}
                className="space-y-2 border-t border-paper-100/10 pt-4 font-mono text-[11px]"
              >
                <div className="flex justify-between text-paper-300/70">
                  <span>RECORD STATUS</span>
                  <span className={reconciled ? "text-signal-ok" : "text-signal-low"}>
                    {reconciled ? "BALANCED (0.00)" : "UNRECONCILED"}
                  </span>
                </div>
                <div className="flex justify-between text-paper-300/70">
                  <span>AUDIT TIMESTAMP</span>
                  <span className="text-paper-100">13-WK TIMELINE</span>
                </div>
                <div className="flex justify-between text-paper-300/70">
                  <span>RECOMMENDED ACTION</span>
                  <span className="text-gold-400">REROUTE TO COURSE</span>
                </div>
              </div>

              {/* Bottom Security Watermark */}
              <div
                style={{ transform: "translateZ(10px)" }}
                className="mt-6 flex items-center justify-between border-t border-dashed border-paper-100/15 pt-3 font-mono text-[9px] uppercase tracking-wider text-paper-300/40"
              >
                <span>CASH FLOW MASTERY</span>
                <span>DUBAI, UAE (GST UTC+4)</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Interactive Pathway Cards (The 3 Ways Forward) */}
        <div className="mt-20 border-t border-ink-700/12 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold-700">
                Direct Navigation Pathways
              </p>
              <h2 className="mt-1 font-display text-2xl text-ink-900 sm:text-3xl">
                Choose your next destination
              </h2>
            </div>
            <p className="text-sm text-ink-400 max-w-xs">
              Every major tool, diagnostic, and curriculum lesson is available below.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {GATEWAYS.map((gateway) => (
              <Link
                key={gateway.id}
                href={gateway.href}
                className="group relative flex flex-col justify-between rounded-xs border border-ink-700/12 bg-paper-50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-600/50 hover:shadow-[0_16px_36px_-15px_rgba(11,30,69,0.12)] hover:bg-paper-100"
              >
                <div className="absolute right-5 top-5 font-mono text-2xl font-light text-ink-700/15 group-hover:text-gold-600/30 transition-colors">
                  {gateway.id}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-xs bg-gold-400/20 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-widest text-gold-700">
                      {gateway.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl text-ink-900 group-hover:text-gold-700 transition-colors">
                    {gateway.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-ink-400">
                    {gateway.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-ink-700/8 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-800 group-hover:text-gold-700 transition-colors">
                  <span>{gateway.cta}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Interactive Search / Quick Finder */}
        <div className="mt-14 rounded-xs border border-ink-700/12 bg-paper-100 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h3 className="font-display text-lg text-ink-900">
                Looking for a specific page or topic?
              </h3>
              <p className="mt-1 text-sm text-ink-400">
                Search our index of pages, pricing tiers, legal terms, and course guides.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search pages (e.g. syllabus, Carl, pricing)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xs border border-ink-700/20 bg-paper-50 px-4 py-2.5 font-sans text-sm text-ink-900 placeholder:text-ink-400/70 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-ink-400 hover:text-ink-900"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtered Search Results */}
          {searchQuery.trim() && (
            <div className="mt-6 border-t border-ink-700/10 pt-4">
              {filteredLinks.length > 0 ? (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {filteredLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-xs bg-paper-50 px-3.5 py-2.5 border border-ink-700/10 hover:border-gold-600 transition-colors"
                      >
                        <span className="text-sm font-medium text-ink-900">
                          {item.title}
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-gold-700 bg-gold-400/15 px-2 py-0.5 rounded-xs">
                          {item.tag}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-400 py-2">
                  No matching internal pages found for &ldquo;{searchQuery}&rdquo;. Try browsing our three main pathways above.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Carl WhatsApp Assistance Footer */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-ink-700/10 pt-6 text-center sm:text-left">
          <p className="text-sm text-ink-400">
            Need urgent assistance or looking for a specific enrolment link?
          </p>
          <a
            href={whatsappUrl("Hi Carl, I reached a 404 page on cashflowmastery.co and need help finding a resource.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-700 hover:text-gold-600 underline underline-offset-4 transition-colors"
          >
            <span>Message Carl directly on WhatsApp</span>
            <span>↗</span>
          </a>
        </div>

      </div>
    </div>
  );
}
