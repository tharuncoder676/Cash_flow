import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { pricing } from "@/content/course";
import { getDb, dbError, UNIQUE_VIOLATION } from "./db";
import type { Tier } from "./pricing";

/**
 * Enrolment store.
 *
 * Backed by Supabase (table `public.enrolments`, see supabase/schema.sql).
 * The JSON file under `.data/` is kept only as a development fallback for a
 * fresh clone with no database configured; production refuses to use it,
 * because a serverless filesystem does not survive and a paid place would be
 * lost. See src/lib/db.ts.
 *
 * The public API below is the only storage surface the rest of the app uses,
 * and it is unchanged from the file-based version — the swap is invisible to
 * every caller.
 */

export type Enrolment = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  tier: Tier;
  /** Amount actually captured, in minor units. */
  amountMinor: number;
  currency: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  createdAt: string;
  /**
   * Set when the payment is fully refunded. The row is kept for the audit
   * trail, but the place no longer counts and access is withdrawn.
   */
  revokedAt?: string | null;
};

/** The database column set, in the snake_case Postgres uses. */
type Row = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  tier: Tier;
  amount_minor: number;
  currency: string;
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
  created_at: string;
  revoked_at: string | null;
};

const COLUMNS =
  "id,email,name,company,tier,amount_minor,currency,stripe_session_id,stripe_payment_intent_id,created_at,revoked_at";

function fromRow(row: Row): Enrolment {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    company: row.company,
    tier: row.tier,
    amountMinor: row.amount_minor,
    currency: row.currency,
    stripeSessionId: row.stripe_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
    createdAt: row.created_at,
    revokedAt: row.revoked_at,
  };
}

function newId(): string {
  return `cfm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/* ------------------------------------------------------------------ */
/* Public API — the only storage surface the rest of the app uses      */
/* ------------------------------------------------------------------ */

/** Paid places taken. Drives pricing tier and capacity everywhere. */
export async function countEnrolments(): Promise<number> {
  const db = getDb();
  if (!db) return (await fileReadAll()).filter((r) => !r.revokedAt).length;

  // head:true asks Postgres for the count without shipping any rows back —
  // this runs on nearly every page render.
  const { count, error } = await db
    .from("enrolments")
    .select("id", { count: "exact", head: true })
    .is("revoked_at", null);

  if (error) throw dbError("countEnrolments", error);
  return count ?? 0;
}

export async function listEnrolments(): Promise<Enrolment[]> {
  const db = getDb();
  if (!db) return fileReadAll();

  const { data, error } = await db
    .from("enrolments")
    .select(COLUMNS)
    .order("created_at", { ascending: true });

  if (error) throw dbError("listEnrolments", error);
  return (data as Row[] | null)?.map(fromRow) ?? [];
}

export async function isCohortFull(): Promise<boolean> {
  return (await countEnrolments()) >= pricing.cohortCapacity;
}

/**
 * Record a paid place.
 *
 * Idempotent on the Stripe session id: Stripe retries webhooks, and a retry
 * must not consume a second seat or double-count the cohort. The guarantee is
 * the UNIQUE constraint on `stripe_session_id`, not a read-then-write in
 * application code — two webhook deliveries can be processed by two server
 * instances at the same moment, and only the database can settle that race.
 */
export async function recordEnrolment(
  entry: Omit<Enrolment, "id" | "createdAt">,
): Promise<{ created: boolean; enrolment: Enrolment }> {
  const db = getDb();
  if (!db) return fileRecord(entry);

  const { data, error } = await db
    .from("enrolments")
    .insert({
      id: newId(),
      email: entry.email,
      name: entry.name,
      company: entry.company,
      tier: entry.tier,
      amount_minor: entry.amountMinor,
      currency: entry.currency,
      stripe_session_id: entry.stripeSessionId,
      stripe_payment_intent_id: entry.stripePaymentIntentId,
      revoked_at: entry.revokedAt ?? null,
    })
    .select(COLUMNS)
    .single();

  if (!error) return { created: true, enrolment: fromRow(data as Row) };

  if (error.code === UNIQUE_VIOLATION) {
    // Already recorded by an earlier delivery of the same event.
    const existing = await findEnrolmentBySession(entry.stripeSessionId);
    if (existing) return { created: false, enrolment: existing };
  }

  throw dbError("recordEnrolment", error);
}

/**
 * Withdraw a place after a full refund. Idempotent: a repeated refund event
 * for the same payment leaves the original revocation time untouched, which
 * the `is("revoked_at", null)` filter enforces in the statement itself.
 */
export async function revokeEnrolmentByPaymentIntent(
  paymentIntentId: string,
): Promise<Enrolment | null> {
  const db = getDb();
  if (!db) return fileRevoke(paymentIntentId);

  const { data, error } = await db
    .from("enrolments")
    .update({ revoked_at: new Date().toISOString() })
    .eq("stripe_payment_intent_id", paymentIntentId)
    .is("revoked_at", null)
    .select(COLUMNS)
    .maybeSingle();

  if (error) throw dbError("revokeEnrolmentByPaymentIntent", error);
  if (data) return fromRow(data as Row);

  // Either there is no such enrolment, or it was already revoked. Both are
  // fine; return the existing row when there is one so the caller can log it.
  const { data: existing, error: lookupError } = await db
    .from("enrolments")
    .select(COLUMNS)
    .eq("stripe_payment_intent_id", paymentIntentId)
    .maybeSingle();

  if (lookupError) throw dbError("revokeEnrolmentByPaymentIntent lookup", lookupError);
  return existing ? fromRow(existing as Row) : null;
}

export async function findEnrolmentBySession(
  sessionId: string,
): Promise<Enrolment | null> {
  const db = getDb();
  if (!db) {
    return (await fileReadAll()).find((r) => r.stripeSessionId === sessionId) ?? null;
  }

  const { data, error } = await db
    .from("enrolments")
    .select(COLUMNS)
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error) throw dbError("findEnrolmentBySession", error);
  return data ? fromRow(data as Row) : null;
}

/* ------------------------------------------------------------------ */
/* Development fallback — JSON on disk, never used in production       */
/* ------------------------------------------------------------------ */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "enrolments.json");

async function fileReadAll(): Promise<Enrolment[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Enrolment[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function fileWriteAll(rows: Enrolment[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
}

async function fileRecord(
  entry: Omit<Enrolment, "id" | "createdAt">,
): Promise<{ created: boolean; enrolment: Enrolment }> {
  const rows = await fileReadAll();
  const existing = rows.find((r) => r.stripeSessionId === entry.stripeSessionId);
  if (existing) return { created: false, enrolment: existing };

  const enrolment: Enrolment = {
    ...entry,
    id: newId(),
    createdAt: new Date().toISOString(),
  };
  rows.push(enrolment);
  await fileWriteAll(rows);
  return { created: true, enrolment };
}

async function fileRevoke(paymentIntentId: string): Promise<Enrolment | null> {
  const rows = await fileReadAll();
  const row = rows.find((r) => r.stripePaymentIntentId === paymentIntentId);
  if (!row) return null;
  if (!row.revokedAt) {
    row.revokedAt = new Date().toISOString();
    await fileWriteAll(rows);
  }
  return row;
}
