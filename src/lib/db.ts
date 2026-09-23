import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Database connection.
 *
 * Everything the site stores — paid places and captured leads — lives in
 * Supabase. The two store modules (`enrolments.ts`, `leads.ts`) are the only
 * callers; nothing else in the codebase touches the database.
 *
 * WHY THE SERVICE-ROLE KEY
 *
 * Both tables have Row Level Security on with no policies, so the public
 * "anon" key can read nothing. Every write happens in a server route that has
 * already checked the request (Stripe signature, origin, rate limit), so the
 * server holds the service-role key and RLS is not doing the authorisation —
 * the route is. That key must never reach the browser: it is read from
 * `SUPABASE_SERVICE_ROLE_KEY`, which has no `NEXT_PUBLIC_` prefix and is
 * therefore never bundled into client code.
 *
 * THE DEVELOPMENT FALLBACK
 *
 * When the variables are absent, the stores fall back to the JSON files under
 * `.data/` so the site still runs on a fresh clone with no accounts set up.
 * That fallback is refused in production: a live deployment writing to an
 * ephemeral filesystem silently loses enrolments, which is the exact failure
 * this migration exists to remove. See `assertStorageConfigured`.
 */

let cached: SupabaseClient | null = null;

function credentials(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

/** True when the database is configured and will be used. */
export function databaseConfigured(): boolean {
  return credentials() !== null;
}

/**
 * The client, or null when the database is not configured.
 *
 * Callers treat null as "use the development file store". In production that
 * situation throws before it can reach a caller — see below.
 */
export function getDb(): SupabaseClient | null {
  if (cached) return cached;

  const creds = credentials();
  if (!creds) {
    assertStorageConfigured();
    return null;
  }

  cached = createClient(creds.url, creds.key, {
    auth: {
      // No end-user sessions here: every call is server-to-server with the
      // service-role key. Persisting or refreshing tokens would be pointless
      // work, and in a serverless function it can leak state between requests.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cached;
}

/**
 * Refuse to run a production deployment on the file store.
 *
 * On Vercel and every other serverless host the filesystem is ephemeral:
 * writes appear to succeed, then vanish. A loud failure at boot is far better
 * than an enrolment that Stripe charged for and the site forgot.
 */
function assertStorageConfigured(): void {
  if (process.env.NODE_ENV !== "production") return;
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in production. " +
      "Without them the site would store enrolments on a filesystem that does " +
      "not survive, and paid places would be lost.",
  );
}

/** Wraps a Supabase error into something worth reading in a log. */
export function dbError(operation: string, error: { message: string; code?: string }): Error {
  return new Error(
    `[db] ${operation} failed: ${error.message}${error.code ? ` (${error.code})` : ""}`,
  );
}

/** Postgres unique-violation. Used to make inserts idempotent. */
export const UNIQUE_VIOLATION = "23505";
