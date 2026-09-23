"use client";

import Link from "next/link";

/**
 * Last-resort boundary for a failure in the root layout itself.
 *
 * It replaces the whole document, so none of the layout's fonts, stylesheet,
 * header or footer exist here. Styles are inline, in the site's colours, with
 * system fonts — this page must render even when everything else has failed.
 */
const MONO = "ui-monospace, SFMono-Regular, Consolas, monospace";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en-AE">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background: "#fbf8f1",
          color: "#0a1631",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <title>Something went wrong — Cash Flow Mastery</title>
        <main style={{ maxWidth: 540 }}>
          <p
            style={{
              margin: 0,
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#7a5617",
            }}
          >
            Cash Flow Mastery
          </p>
          <h1
            style={{
              margin: "14px 0 0",
              fontSize: 38,
              lineHeight: 1.15,
              fontWeight: 400,
            }}
          >
            Something went wrong on our side.
          </h1>
          <p
            style={{
              margin: "18px 0 0",
              fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
              fontSize: 17,
              lineHeight: 1.6,
              color: "#425073",
            }}
          >
            The site couldn’t load. Please try again in a moment.
          </p>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                border: 0,
                borderRadius: 2,
                background: "#0b1e45",
                color: "#fbf8f1",
                padding: "14px 24px",
                fontFamily: MONO,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                borderRadius: 2,
                border: "1px solid rgba(11,30,69,0.3)",
                color: "#0b1e45",
                padding: "13px 24px",
                fontFamily: MONO,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Homepage
            </Link>
          </div>
          {error.digest && (
            <p
              style={{
                margin: "28px 0 0",
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.12em",
                color: "#425073",
              }}
            >
              REFERENCE: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
