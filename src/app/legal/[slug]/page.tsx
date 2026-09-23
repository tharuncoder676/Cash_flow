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
    <div className="bg-paper-100">
      <Container width="narrow" className="py-16 sm:py-20">
        <Eyebrow className="mb-5">Legal</Eyebrow>
        <h1 className="font-display text-[2.4rem] leading-[1.12] tracking-[-0.025em] text-ink-900 sm:text-[3rem]">
          {doc.title}
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-400">
          {doc.description}
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-300">
          {doc.lastUpdated
            ? `Last updated ${doc.lastUpdated}`
            : "Not yet published"}
        </p>

        {pending && (
          <div
            role="note"
            className="mt-10 rounded-xs border-l-2 border-signal-low bg-signal-low/6 p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-signal-low">
              Awaiting legal review — not in force
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-400">
              This page is a structural outline prepared during the build. It
              is <strong className="text-ink-900">not a policy</strong>, nothing
              on it is binding, and it is excluded from search engines. The
              headings below set out what the approved document needs to cover;
              the wording itself must come from {site.name}’s legal and tax
              advisers before launch.
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
                    <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-ink-400">
                      {section.body.map((para) => (
                        <p key={para.slice(0, 32)}>{para}</p>
                      ))}
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
