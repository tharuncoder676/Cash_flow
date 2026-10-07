import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/primitives";
import { legalDocs } from "@/content/legal";
import { site } from "@/content/course";

export const metadata: Metadata = {
  title: "Legal Policies & Website Terms",
  description:
    "Official policies, course terms of sale, refund rules, privacy disclosures, and training disclaimers for Cash Flow Mastery.",
  alternates: { canonical: "/legal" },
  robots: { index: true, follow: true },
};

const DOC_BADGES: Record<string, string> = {
  terms: "Terms of Sale",
  refunds: "Refund & Cancellation",
  privacy: "GDPR & UAE Compliant",
  cookies: "Cookie Notice",
  disclaimer: "Educational Disclaimer",
};

export default function LegalIndexPage() {
  return (
    <div className="bg-paper-100 min-h-screen">
      {/* Header Banner */}
      <section className="border-b border-ink-700/10 bg-paper-200 py-16 sm:py-20">
        <Container width="narrow">
          <Eyebrow className="mb-5">Policies & Compliance</Eyebrow>
          <h1 className="font-display text-[2.5rem] leading-[1.12] tracking-[-0.025em] text-ink-900 sm:text-[3.2rem]">
            Legal Policies &amp; Terms
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-400">
            All official policies governing participation in Cash Flow Mastery, website usage, data protection, and refund and cancellation policies.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
            <span>Version 1.0</span>
            <span aria-hidden="true">·</span>
            <span>Effective 2 October 2026</span>
            <span aria-hidden="true">·</span>
            <span className="text-gold-700">Independent Advisors FZE</span>
          </div>
        </Container>
      </section>

      {/* Policy Directory Cards */}
      <section className="py-14 sm:py-20">
        <Container width="narrow">
          <div className="grid gap-6">
            {legalDocs.map((doc, idx) => (
              <Link
                key={doc.slug}
                href={`/legal/${doc.slug}`}
                className="group relative block rounded-xs border border-ink-700/12 bg-paper-50 p-6 sm:p-8 transition-all duration-300 hover:border-gold-600/60 hover:bg-paper-100 hover:shadow-[0_12px_32px_-12px_rgba(5,14,36,0.12)] hover:-translate-y-0.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] tracking-[0.16em] text-gold-700">
                      0{idx + 1}
                    </span>
                    <span className="rounded-xs border border-gold-600/25 bg-gold-500/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-gold-700">
                      {DOC_BADGES[doc.slug] || "Policy"}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-ink-400 sm:text-right">
                    {doc.sections.length} Sections
                  </span>
                </div>

                <h2 className="mt-4 font-display text-2xl text-ink-900 group-hover:text-gold-700 transition-colors">
                  {doc.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-400">
                  {doc.description}
                </p>

                <div className="mt-5 flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-gold-700">
                  <span>Read full policy</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-14 rounded-xs border border-ink-700/10 bg-paper-200/60 p-6 sm:p-8 text-center sm:text-left">
            <h3 className="font-display text-lg text-ink-900">
              Questions regarding our policies?
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-400">
              For legal inquiries, data rights requests, or clarifications regarding course terms, contact{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-gold-700 underline underline-offset-4"
              >
                {site.contactEmail}
              </a>
              .
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
