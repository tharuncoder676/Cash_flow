import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import PreviewBanner from "@/components/PreviewBanner";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Motion from "@/components/Motion";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Polish from "@/components/Polish";
import SecurityShield from "@/components/SecurityShield";
import { site, promise } from "@/content/course";
import { isIndexable } from "@/lib/env";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  // Without "italic" the browser SYNTHESISES the slant by shearing the
  // roman, which is what the gold line of the hero headline was getting.
  // Fraunces ships a drawn italic with genuinely different letterforms.
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: promise.core,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: promise.core,
    locale: "en_AE",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: promise.core,
  },
  // Belt and braces alongside robots.txt: the meta tag also stops a page
  // being indexed if it is reached by a direct link rather than a crawl.
  robots: isIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AE"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
      // globals.css sets scroll-behavior: smooth for in-page anchors (the
      // ledger rail, #enrol). Without this attribute Next.js also runs its
      // route-change scroll-to-top smoothly: from deep in the homepage a nav
      // click slid upward for ~1.5s and stopped 114px short of the top, which
      // read as the page never finishing loading. With it, Next suspends the
      // smooth behaviour just for navigations and anchors stay smooth.
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only rounded-xs focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink-700 focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-paper-100"
        >
          Skip to content
        </a>
        <PreviewBanner />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <Motion />
        <WhatsAppFloat />
        <Polish />
        <SecurityShield />
      </body>
    </html>
  );
}
