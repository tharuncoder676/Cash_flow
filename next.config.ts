import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Built to keep pages statically pre-rendered. The strictest form of CSP
 * needs a fresh nonce on every request, which in Next.js forces every page to
 * render per visit — slower and costlier for a marketing site. So scripts are
 * limited by origin (this site and Stripe) with inline scripts allowed, and
 * the policy is strict where it matters most here: no framing by other sites,
 * no form posts to other origins, no plugins, no <base> hijacking.
 *
 * Stripe's embedded Checkout needs js.stripe.com for its script and frames,
 * and api.stripe.com for its requests. Fonts are self-hosted by next/font.
 * Dev adds 'unsafe-eval' and websockets for Fast Refresh only.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.stripe.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.stripe.com",
  "font-src 'self' data:",
  `connect-src 'self' https://api.stripe.com https://*.stripe.com${isDev ? " ws: wss:" : ""}`,
  "frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Force HTTPS in production browsers (HSTS)
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]),
  // Older browsers ignore frame-ancestors; this covers them for clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // The payment confirmation URL carries a Stripe session id; only the
  // origin is ever passed on to another site.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value:
      'camera=(), microphone=(), geolocation=(), usb=(), browsing-topics=(), payment=(self "https://js.stripe.com")',
  },
  // Isolates this window from pages it opens, while still letting Stripe's
  // wallet and 3-D Secure pop-ups work.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
