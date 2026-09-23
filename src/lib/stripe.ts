import "server-only";
import Stripe from "stripe";

/**
 * Server-side Stripe client.
 *
 * The secret key is read lazily so that pages which do not touch payments
 * still render in an environment without it configured — useful while the
 * client's UAE Stripe entity is still being set up.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Copy .env.example to .env.local and add the keys from the Stripe dashboard.",
    );
  }

  cached = new Stripe(key, { typescript: true });
  return cached;
}

/** True when payments are configured; lets the UI degrade to the waitlist. */
export function paymentsConfigured(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
}

/**
 * Absolute origin for Stripe's return_url.
 *
 * Server-side only, and used for nothing else — canonical URLs and the sitemap
 * come from `site.url` in the content file.
 *
 * Preview deployments each get their own hostname, so an explicit value cannot
 * be right for all of them. VERCEL_URL is set per deployment and points at the
 * deployment being served, which sends the buyer back to the same preview they
 * paid on rather than to production.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3100";
}
