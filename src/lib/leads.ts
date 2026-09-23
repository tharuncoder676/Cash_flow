import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getDb, dbError } from "./db";

/**
 * Lead and waitlist capture.
 *
 * Backed by Supabase (table `public.leads`, see supabase/schema.sql), with the
 * same development-only file fallback as the enrolment store. Brief §8
 * requires consent capture, so consent is stored explicitly with the exact
 * wording shown and a timestamp, rather than assumed.
 */

export type LeadSource = "diagnostic" | "waitlist" | "forecast";

export type Lead = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  source: LeadSource;
  /** Explicit opt-in to the nurturing sequence. Never defaulted to true. */
  marketingConsent: boolean;
  consentText: string;
  /**
   * What the person was looking at when they handed over their email — for a
   * forecast lead, the figures they entered and the gap it produced. A lead
   * with their own numbers attached is worth far more to Carl than a bare
   * address, and it would be lost if it were not stored with the row.
   */
  context: string | null;
  createdAt: string;
};

type Row = {
  id: string;
  email: string;
  name: string | null;
  company: string | null;
  source: LeadSource;
  marketing_consent: boolean;
  consent_text: string;
  context: string | null;
  created_at: string;
};

const COLUMNS =
  "id,email,name,company,source,marketing_consent,consent_text,context,created_at";

function fromRow(row: Row): Lead {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    company: row.company,
    source: row.source,
    marketingConsent: row.marketing_consent,
    consentText: row.consent_text,
    context: row.context,
    createdAt: row.created_at,
  };
}

function newId(): string {
  return `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Record a lead.
 *
 * One row per email per source — re-submitting refreshes consent rather than
 * creating a duplicate the client would have to de-dupe later. That is the
 * UNIQUE (email, source) constraint plus an upsert, so two submissions
 * arriving together cannot both insert.
 */
export async function recordLead(
  entry: Omit<Lead, "id" | "createdAt">,
): Promise<Lead> {
  const email = entry.email.trim().toLowerCase();
  const db = getDb();
  if (!db) return fileRecord({ ...entry, email });

  const { data, error } = await db
    .from("leads")
    .upsert(
      {
        // No id here on purpose. Supabase upserts as INSERT ... ON CONFLICT
        // DO UPDATE SET <every column supplied>, so sending an id would give
        // a returning visitor a brand new primary key. The column has a
        // database default for the insert case instead.
        email,
        name: entry.name,
        company: entry.company,
        source: entry.source,
        marketing_consent: entry.marketingConsent,
        consent_text: entry.consentText,
        context: entry.context,
        created_at: new Date().toISOString(),
      },
      // Refresh the consent wording and the time it was given, matching the
      // behaviour of the file store this replaces: created_at records when
      // the stored consent was actually given, not first contact.
      { onConflict: "email,source", ignoreDuplicates: false },
    )
    .select(COLUMNS)
    .single();

  if (error) throw dbError("recordLead", error);
  return fromRow(data as Row);
}

export async function countLeads(source?: LeadSource): Promise<number> {
  const db = getDb();
  if (!db) {
    const rows = await fileReadAll();
    return source ? rows.filter((r) => r.source === source).length : rows.length;
  }

  let query = db.from("leads").select("id", { count: "exact", head: true });
  if (source) query = query.eq("source", source);

  const { count, error } = await query;
  if (error) throw dbError("countLeads", error);
  return count ?? 0;
}

export async function listLeads(source?: LeadSource): Promise<Lead[]> {
  const db = getDb();
  if (!db) {
    const rows = await fileReadAll();
    return source ? rows.filter((r) => r.source === source) : rows;
  }

  let query = db.from("leads").select(COLUMNS).order("created_at", { ascending: false });
  if (source) query = query.eq("source", source);

  const { data, error } = await query;
  if (error) throw dbError("listLeads", error);
  return (data as Row[] | null)?.map(fromRow) ?? [];
}

/** Minimal shape check. Real validation happens at the CRM boundary too. */
export function isValidEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
  );
}

/* ------------------------------------------------------------------ */
/* Development fallback — JSON on disk, never used in production       */
/* ------------------------------------------------------------------ */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "leads.json");

async function fileReadAll(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Lead[]) : [];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function fileRecord(entry: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const rows = await fileReadAll();
  const idx = rows.findIndex(
    (r) => r.email.toLowerCase() === entry.email.toLowerCase() && r.source === entry.source,
  );

  const lead: Lead = {
    ...entry,
    id: idx >= 0 ? rows[idx].id : newId(),
    createdAt: new Date().toISOString(),
  };

  if (idx >= 0) rows[idx] = lead;
  else rows.push(lead);

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf8");
  return lead;
}
