import "server-only";

/**
 * Request guards shared by the public POST endpoints.
 *
 * Deliberately NOT applied to the Stripe webhook: Stripe calls it from its own
 * servers with no browser Origin, in bursts, and it is already authenticated by
 * signature verification — throttling it would drop real payments.
 */

/* ------------------------------------------------------------------ */
/* Origin check (item 7)                                               */
/* ------------------------------------------------------------------ */

/**
 * Rejects browser requests that were started by another website.
 *
 * Checks modern Sec-Fetch-Site header (rejects "cross-site") as well as
 * comparing Origin with actual Host header.
 */
export function isSameOrigin(request: Request): boolean {
  // Sec-Fetch-Site is set by modern browsers and cannot be forged by script
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite === "cross-site") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Rate limit (item 4)                                                 */
/* ------------------------------------------------------------------ */

const hits = new Map<string, number[]>();

export function clientIp(request: Request): string {
  // Check trusted proxy headers in order
  const vercelIp = request.headers.get("x-vercel-ip");
  if (vercelIp) return vercelIp.trim();

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0].trim();
    if (first) return first;
  }

  return "unknown";
}

/** Sanitize user string inputs against control characters and null bytes. */
export function sanitizeString(value: unknown, maxLen = 250): string | null {
  if (typeof value !== "string") return null;
  // Strip null bytes and control chars, keep normal printable unicode
  const cleaned = value
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, "")
    .trim()
    .slice(0, maxLen);
  return cleaned.length > 0 ? cleaned : null;
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: true } | { ok: false; retryAfterSeconds: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return {
      ok: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((windowMs - (now - recent[0])) / 1000),
      ),
    };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [k, times] of hits) {
      if (times.length === 0 || now - times[times.length - 1] > windowMs) {
        hits.delete(k);
      }
    }
  }
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Body size cap (item 6)                                              */
/* ------------------------------------------------------------------ */

export class RequestBodyError extends Error {
  constructor(
    readonly status: 400 | 413,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Reads a JSON object body, refusing anything larger than `maxBytes`.
 *
 * The body is read as a stream and abandoned the moment it passes the cap.
 * Checking Content-Length alone is not enough — it can be omitted or false —
 * and `request.json()` would buffer the whole payload first. Before this,
 * a 1.5 MB junk body was read in full before being rejected.
 *
 * An empty body resolves to `{}`.
 */
export async function readJsonBody(
  request: Request,
  maxBytes: number,
): Promise<Record<string, unknown>> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new RequestBodyError(413, "Request too large.");
  }

  const reader = request.body?.getReader();
  if (!reader) return {};

  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new RequestBodyError(413, "Request too large.");
    }
    chunks.push(value);
  }

  const text = Buffer.concat(chunks).toString("utf8").trim();
  if (text === "") return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new RequestBodyError(400, "Invalid request.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new RequestBodyError(400, "Invalid request.");
  }
  return parsed as Record<string, unknown>;
}
