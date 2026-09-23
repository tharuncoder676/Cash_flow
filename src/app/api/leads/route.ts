import { NextResponse } from "next/server";
import { isValidEmail, recordLead, type LeadSource } from "@/lib/leads";
import {
  RequestBodyError,
  clientIp,
  isSameOrigin,
  rateLimit,
  readJsonBody,
} from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONSENT_TEXT =
  "Email me occasional practical cash-flow guidance and news about the founding cohort. Unsubscribe from any email. Details are not shared.";

const SOURCES: LeadSource[] = ["diagnostic", "waitlist", "forecast"];

/** Name, email, company, consent and forecast figures fit well inside this. */
const MAX_BODY_BYTES = 10_000;
/** Faster than any person can read a form and type an address. */
const MIN_FILL_MS = 1_200;

function clean(value: unknown, max = 120): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const limited = rateLimit(`leads:${clientIp(request)}`, 8, 10 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSeconds) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await readJsonBody(request, MAX_BODY_BYTES);
  } catch (err) {
    const status = err instanceof RequestBodyError ? err.status : 400;
    return NextResponse.json(
      {
        error:
          status === 413 ? "That request was too large." : "Invalid request.",
      },
      { status },
    );
  }

  // Honeypot filled: report success, store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const elapsed = Number(body.elapsedMs);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return NextResponse.json(
      { error: "That was very quick — please try again." },
      { status: 400 },
    );
  }

  if (!isValidEmail(body.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const source = SOURCES.includes(body.source as LeadSource)
    ? (body.source as LeadSource)
    : "diagnostic";

  try {
    await recordLead({
      email: body.email.trim().toLowerCase(),
      name: clean(body.name),
      company: clean(body.company),
      source,
      marketingConsent: body.marketingConsent === true,
      consentText: CONSENT_TEXT,
      // Stored as a capped JSON string: this is untrusted input, so it is
      // never spread into the row and never allowed to grow unbounded.
      context:
        body.context && typeof body.context === "object"
          ? JSON.stringify(body.context).slice(0, 800)
          : null,
    });

    // TODO(phase-two): push to the CRM / email platform and trigger the
    // nurturing sequence. Storage seam lives in src/lib/leads.ts.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[leads] failed to record", err);
    return NextResponse.json(
      { error: "We couldn’t save that. Please try again." },
      { status: 500 },
    );
  }
}
