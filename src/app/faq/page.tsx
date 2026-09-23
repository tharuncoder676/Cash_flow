import type { Metadata } from "next";
import Link from "next/link";
import {
  ButtonLink,
  Container,
  Eyebrow,
  Section,
} from "@/components/primitives";
import { contact, faqs, site, whatsappUrl } from "@/content/course";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Suitability, time commitment, live-session dates, access period, templates, confidentiality, refunds, VAT and support for the Cash Flow Mastery founding cohort.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  // Structured data so the answers can surface in search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so no answer text can ever close this <script>
        // early. The FAQ is static today; this matters the day it isn't.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-paper-200 py-16 sm:py-20">
        <Container width="narrow">
          <Eyebrow className="mb-6">Questions</Eyebrow>
          <h1 className="font-display text-[2.6rem] leading-[1.12] tracking-[-0.025em] text-ink-900 sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-400">
            If something here is still unclear, email{" "}
            <a
              href={`mailto:${contact.email}`}
              className="text-gold-700 underline underline-offset-4"
            >
              {contact.email}
            </a>{" "}
            or message{" "}
            <a
              href={whatsappUrl(
                `Hi Carl — I have a question about ${site.name}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-700 underline underline-offset-4"
            >
              {contact.phone} on WhatsApp
            </a>
            . {contact.replyPromise}
          </p>
        </Container>
      </section>

      <Section tone="paper" width="narrow">
        <dl className="divide-y divide-ink-700/12 border-y border-ink-700/12">
          {faqs.map((faq) => (
            <div key={faq.q} className="py-7">
              <dt className="font-display text-[1.4rem] leading-snug text-ink-900">
                {faq.q}
              </dt>
              <dd className="mt-3.5 text-[16px] leading-relaxed text-ink-400">
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 rounded-xs border border-ink-700/15 bg-paper-50 p-8 text-center sm:p-10">
          <h2 className="font-display text-2xl text-ink-900">
            Still deciding?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-ink-400">
            The diagnostic is free and takes four minutes. It will tell you
            whether this is the right thing for you right now — including if
            the answer is no.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/diagnostic" variant="gold">
              Take the diagnostic
            </ButtonLink>
            <ButtonLink href="/course" variant="ghost">
              See the programme
            </ButtonLink>
          </div>
          <p className="mt-6 text-[13px] text-ink-400">
            Cohort full?{" "}
            <Link
              href="/waitlist"
              className="text-gold-700 underline underline-offset-4"
            >
              Join the waitlist
            </Link>
          </p>
        </div>
      </Section>
    </>
  );
}
