import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const ELSEWHERE = [
  { href: "/diagnostic", label: "Take the free diagnostic" },
  { href: "/about", label: "About Carl" },
  { href: "/faq", label: "Frequently asked questions" },
];

export default function NotFound() {
  return (
    <section className="bg-paper-200 py-20 sm:py-28">
      <Container width="narrow">
        <Eyebrow className="mb-6">Error 404</Eyebrow>
        <h1 className="font-display text-[2.6rem] leading-[1.12] tracking-[-0.025em] text-balance text-ink-900 sm:text-5xl">
          This page isn’t on the books.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-ink-400">
          The link may be old or mistyped. Everything about the programme is
          one click away.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/">Back to the homepage</ButtonLink>
          <ButtonLink href="/course" variant="ghost">
            See the programme
          </ButtonLink>
        </div>

        <ul className="mt-12 divide-y divide-ink-700/12 border-y border-ink-700/12">
          {ELSEWHERE.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center justify-between py-4 font-mono text-[11.5px] font-bold uppercase tracking-[0.14em] text-ink-800 transition-colors hover:text-gold-700"
              >
                {item.label}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
