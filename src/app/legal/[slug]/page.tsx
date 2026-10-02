import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/primitives";
import { getLegalDoc, legalDocs } from "@/content/legal";
import { site } from "@/content/course";

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: `/legal/${doc.slug}` },
    // An unreviewed skeleton must never be indexed as if it were policy.
    robots:
      doc.status === "approved"
        ? { index: true, follow: true }
        : { index: false, follow: false },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  const pending = doc.status !== "approved";

  return (
    <div className="bg-paper-100 min-h-screen">
      {/* Top Policy Switcher Header */}
      <div className="border-b border-ink-700/10 bg-paper-200/90 backdrop-blur-md sticky top-[72px] z-40">
        <Container width="narrow" className="py-3">
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-1">
            <Link
              href="/legal"
              className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-700 hover:text-gold-700 transition-colors shrink-0 pr-3 border-r border-ink-700/15"
            >
              <span>←</span>
              <span>All Policies</span>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4 shrink-0" aria-label="Policy tabs">
              {legalDocs.map((d) => {
                const isActive = d.slug === doc.slug;
                return (
                  <Link
                    key={d.slug}
                    href={`/legal/${d.slug}`}
                    className={`rounded-xs px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-ink-900 text-gold-400 font-bold shadow-xs"
                        : "text-ink-400 hover:text-ink-900 hover:bg-paper-100/80"
                    }`}
                  >
                    {d.shortTitle || d.title}
                  </Link>
                );
              })}
            </nav>
          </div>
        </Container>
      </div>

      <Container width="narrow" className="py-14 sm:py-20">
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/legal"
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold-700 hover:underline"
          >
            Policies
          </Link>
          <span className="text-ink-300 font-mono">/</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-400">
            {doc.title}
          </span>
        </div>

        <h1 className="font-display text-[2.4rem] leading-[1.12] tracking-[-0.025em] text-ink-900 sm:text-[3rem]">
          {doc.title}
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-400">
          {doc.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-400">
          <span>Version {doc.version}</span>
          <span aria-hidden="true">·</span>
          <span>Effective {doc.effectiveDate}</span>
          <span aria-hidden="true">·</span>
          <span className="text-gold-700">Independent Advisors FZE</span>
        </div>


        {pending && (
          <div
            role="note"
            className="mt-10 rounded-xs border-l-2 border-signal-low bg-signal-low/6 p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal-low">
              Awaiting legal review — not in force
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              This page is a structural outline prepared during the build.
            </p>
          </div>
        )}

        {/* Sections ---------------------------------------------------- */}
        <div className="mt-14 divide-y divide-ink-700/12 border-t border-ink-700/12">
          {doc.sections.map((section, i) => (
            <section key={section.heading} className="py-8">
              <div className="flex gap-5">
                <span className="font-mono text-[11px] tracking-[0.14em] text-gold-700">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-[1.4rem] leading-snug text-ink-900">
                    {section.heading}
                  </h2>

                  {section.body?.length ? (
                    <div className="mt-4 space-y-3.5 text-[16px] leading-relaxed text-ink-400">
                      {section.body.map((para, pIdx) => {
                        if (para.startsWith("• ")) {
                          return (
                            <p key={pIdx} className="flex gap-2.5 pl-2 text-ink-600">
                              <span aria-hidden="true" className="text-gold-600 font-bold">•</span>
                              <span>{para.slice(2)}</span>
                            </p>
                          );
                        }
                        return <p key={pIdx}>{para}</p>;
                      })}
                    </div>
                  ) : (
                    <p className="mt-3 text-[15px] leading-relaxed text-ink-300 italic">
                      {section.prompt}
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 text-[15px] leading-relaxed text-ink-400">
          Questions about any of this?{" "}
          <a
            href={`mailto:${site.contactEmail}`}
            className="text-gold-700 underline underline-offset-4"
          >
            {site.contactEmail}
          </a>
        </p>

        <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink-700/12 pt-7">
          {legalDocs
            .filter((d) => d.slug !== doc.slug)
            .map((d) => (
              <Link
                key={d.slug}
                href={`/legal/${d.slug}`}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400 transition-colors hover:text-ink-900"
              >
                {d.title}
              </Link>
            ))}
        </nav>
      </Container>
    </div>
  );
}
