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
 * Compares the Origin header with the host this request actually arrived on,
 * rather than a configured site URL, so it keeps working on preview
 * deployments and localhost. A request with no Origin is allowed through:
 * browsers always send one on a cross-site fetch POST, so a missing header
 * means a non-browser client — which the rate limit and validation still cover.
 */
export function isSameOrigin(request: Request): boolean {
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

/**
 * Sliding-window limit, keyed by caller.
 *
 * HONEST LIMITATION: this lives in the memory of one serverless instance. On
 * Vercel a burst can be spread across several instances, and a cold start
 * resets the count — so this slows abuse down rather than guaranteeing a
 * ceiling. A hard limit needs Vercel Firewall rules or a shared store such as
 * Upstash Redis. The function signature is the seam for that swap.
 */
const hits = new Map<string, number[]>();

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
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
