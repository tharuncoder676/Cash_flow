import Link from "next/link";
import { Container, Eyebrow } from "./primitives";
import CashFlowMark from "./CashFlowMark";
import IndependentAdvisorsLogo from "./IndependentAdvisorsLogo";
import { site, carl, contact, whatsappUrl } from "@/content/course";

const COLUMNS = [
  {
    title: "Course",
    links: [
      { href: "/course", label: "The programme" },
      { href: "/course#curriculum", label: "Curriculum" },
      { href: "/course#enrol", label: "Pricing and places" },
      { href: "/waitlist", label: "Join the waitlist" },
    ],
  },
  {
    title: "Start free",
    links: [
      { href: "/diagnostic", label: "Cash Visibility Diagnostic" },
      { href: "/faq", label: "Frequently asked questions" },
      { href: "/about", label: "About Carl" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal", label: "All policies & overview" },
      { href: "/legal/terms", label: "Course terms of sale" },
      { href: "/legal/refunds", label: "Refunds and cancellation" },
      { href: "/legal/privacy", label: "Privacy policy" },
      { href: "/legal/cookies", label: "Cookie notice" },
      { href: "/legal/disclaimer", label: "Training disclaimer" },
    ],
  },
];


export default function SiteFooter() {
  return (
    <footer className="bg-ink-900 text-paper-300">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand ---------------------------------------------------- */}
          <div>
            <div className="brand-lockup flex items-center gap-3">
              <CashFlowMark className="h-10 w-10" />
              <span className="flex flex-col gap-1">
                <span className="flex items-baseline gap-2.5">
                  <span className="font-display text-xl text-paper-100">
                    Cash Flow
                  </span>
                  <span className="font-display text-xl italic text-gold-500">
                    Mastery
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="brand-thread block h-px w-3 bg-gold-500"
                  />
                  <IndependentAdvisorsLogo
                    className="h-[17px] w-auto"
                    tone="dark"
                  />
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-pretty text-[15px] leading-relaxed text-paper-300/65">
              {site.tagline} A four-week programme for owner-led SMEs, taught by{" "}
              {carl.name}, {carl.credentials}.
            </p>
            <dl className="mt-7 space-y-3">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-300/55">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${contact.email}`}
                    className="-mx-1 inline-flex min-h-10 items-center px-1 text-[15px] text-gold-500 underline-offset-4 transition-colors hover:text-gold-400 hover:underline sm:min-h-0"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-300/55">
                  Phone &amp; WhatsApp
                </dt>
                <dd className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <a
                    href={`tel:+${contact.phoneE164}`}
                    className="-mx-1 inline-flex min-h-10 items-center px-1 text-[15px] text-gold-500 underline-offset-4 transition-colors hover:text-gold-400 hover:underline sm:min-h-0"
                  >
                    {contact.phone}
                  </a>
                  <span aria-hidden="true" className="text-paper-300/55">
                    ·
                  </span>
                  <a
                    href={whatsappUrl(
                      `Hi Carl — I have a question about ${site.name}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-mx-1 inline-flex min-h-10 items-center px-1 text-[15px] text-gold-500 underline-offset-4 transition-colors hover:text-gold-400 hover:underline sm:min-h-0"
                  >
                    WhatsApp
                  </a>
                </dd>
              </div>

              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-paper-300/55">
                  Hours
                </dt>
                <dd className="mt-1 text-[15px] text-paper-300/70">
                  {contact.hours}
                </dd>
              </div>
            </dl>
          </div>

          {/* Link columns --------------------------------------------- */}
          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <Eyebrow tone="cream" className="mb-5">
                  {col.title}
                </Eyebrow>
                <ul className="space-y-0.5 sm:space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="-mx-1 flex min-h-10 items-center px-1 text-[14.5px] leading-snug text-paper-300/70 underline-offset-4 transition-colors hover:text-paper-100 hover:underline sm:min-h-0"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Baseline ---------------------------------------------------- */}
        <div className="mt-14 flex flex-col gap-4 border-t border-paper-100/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-wide text-paper-300/65">
            © {new Date().getFullYear()} {site.name}
          </p>
          <p className="font-mono text-[11px] tracking-wide text-paper-300/65">
            A programme by{" "}
            <a
              href={site.parentBrand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500 underline-offset-4 transition-colors hover:text-gold-400 hover:underline"
            >
              {site.parentBrand.name}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
