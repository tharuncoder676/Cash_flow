"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLink } from "./primitives";
import CashFlowMark from "./CashFlowMark";
import DockNav from "./DockNav";
import IndependentAdvisorsLogo from "./IndependentAdvisorsLogo";
import { site } from "@/content/course";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/course", label: "The course" },
  { href: "/diagnostic", label: "Free diagnostic" },
  { href: "/about", label: "About Carl" },
  { href: "/faq", label: "FAQs" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the open sheet.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      // Named so page transitions leave it perfectly still: one stable
      // reference point while the content beneath it changes.
      style={{ viewTransitionName: "site-header" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink-700/10 bg-paper-100/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between gap-6 px-6 sm:px-8">
        <Link
          href="/"
          className="brand-lockup group flex items-center gap-3"
          aria-label={`${site.name}, by ${site.parentBrand.name} — home`}
        >
          <CashFlowMark className="h-9 w-9" />

          <span className="flex flex-col gap-[3px]">
            <span className="flex items-baseline gap-2">
              <span className="font-display text-[19px] leading-none tracking-[-0.01em] text-ink-900">
                Cash Flow
              </span>
              <span className="font-display text-[19px] italic leading-none tracking-[-0.01em] text-gold-700">
                Mastery
              </span>
            </span>

            {/* The parent brand as its own logo rather than as words: a gold
                thread runs out of the mark and into the Independent Advisors
                lockup, so the lineage reads at a glance. */}
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="brand-thread block h-px w-3 bg-gold-600"
              />
              <IndependentAdvisorsLogo className="h-[19px] w-auto" />
            </span>
          </span>
        </Link>

        {/* Desktop nav — dock-style magnification over real links. */}
        <DockNav items={NAV} pathname={pathname} />

        <div className="flex items-center gap-3">
          {/* Wrapper carries the breakpoint: putting `hidden` on the button
              itself collides with the `inline-flex` in its base classes. */}
          <span className="hidden sm:block">
            <ButtonLink href="/course#enrol" size="sm">
              Join the cohort
            </ButtonLink>
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-10 w-10 items-center justify-center lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-ink-900 transition-all duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-5 bg-ink-900 transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-5 bg-ink-900 transition-all duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Reading progress — a thin gold rail under the header. */}
      <div
        aria-hidden="true"
        className={`h-px origin-left bg-gold-600 transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "scaleX(var(--scroll-progress, 0))" }}
      />

      {/* Mobile sheet ------------------------------------------------- */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-ink-700/10 bg-paper-100 lg:hidden"
      >
        {/* Closing happens on the click rather than in an effect keyed on the
            pathname — tapping the link for the current page must still close
            the sheet, and that navigation fires no pathname change. */}
        <nav
          className="px-6 py-6 sm:px-8"
          aria-label="Mobile navigation"
          onClick={() => setOpen(false)}
        >
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-ink-700/8">
                <Link
                  href={item.href}
                  className="block py-4 font-display text-2xl font-semibold text-ink-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink href="/course#enrol" className="mt-7 w-full">
            Join the cohort
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
