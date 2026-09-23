/**
 * One-off import of the phase-one JSON store into Supabase.
 *
 *   node scripts/import-to-supabase.mjs          # report what would happen
 *   node scripts/import-to-supabase.mjs --write  # actually insert
 *
 * Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local.
 *
 * Safe to run more than once: enrolments are matched on stripe_session_id and
 * leads on (email, source), both of which are UNIQUE in the schema, so an
 * existing row is skipped rather than duplicated.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const WRITE = process.argv.includes("--write");
const ROOT = process.cwd();

/** Minimal .env.local reader — this script runs outside Next.js. */
async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
    }
  } catch {
    /* fall through to real environment variables */
  }
}

async function readJson(file) {
  try {
    const raw = await readFile(path.join(ROOT, ".data", file), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}

await loadEnv();

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const enrolments = await readJson("enrolments.json");
const leads = await readJson("leads.json");

console.log(`local files: ${enrolments.length} enrolment(s), ${leads.length} lead(s)`);
if (!WRITE) console.log("dry run — pass --write to import\n");

let inserted = 0;
let skipped = 0;

for (const e of enrolments) {
  const { data: existing } = await db
    .from("enrolments")
    .select("id")
    .eq("stripe_session_id", e.stripeSessionId)
    .maybeSingle();

  if (existing) {
    skipped++;
    console.log(`  skip enrolment ${e.email} — already in the database`);
    continue;
  }
  if (!WRITE) {
    inserted++;
    console.log(`  would insert enrolment ${e.email} (${e.currency} ${e.amountMinor / 100})`);
    continue;
  }

  const { error } = await db.from("enrolments").insert({
    id: e.id,
    email: e.email,
    name: e.name ?? null,
    company: e.company ?? null,
    tier: e.tier,
    amount_minor: e.amountMinor,
    currency: e.currency,
    stripe_session_id: e.stripeSessionId,
    stripe_payment_intent_id: e.stripePaymentIntentId ?? null,
    created_at: e.createdAt,
    revoked_at: e.revokedAt ?? null,
  });
  if (error) {
    console.error(`  FAILED enrolment ${e.email}: ${error.message}`);
    process.exitCode = 1;
  } else {
    inserted++;
    console.log(`  inserted enrolment ${e.email}`);
  }
}

for (const l of leads) {
  const email = String(l.email).trim().toLowerCase();
  const { data: existing } = await db
    .from("leads")
    .select("id")
    .eq("email", email)
    .eq("source", l.source)
    .maybeSingle();

  if (existing) {
    skipped++;
    console.log(`  skip lead ${email} (${l.source}) — already in the database`);
    continue;
  }
  if (!WRITE) {
    inserted++;
    console.log(`  would insert lead ${email} (${l.source})`);
    continue;
  }

  const { error } = await db.from("leads").insert({
    id: l.id,
    email,
    name: l.name ?? null,
    company: l.company ?? null,
    source: l.source,
    marketing_consent: Boolean(l.marketingConsent),
    consent_text: l.consentText ?? "",
    context: l.context ?? null,
    created_at: l.createdAt,
  });
  if (error) {
    console.error(`  FAILED lead ${email}: ${error.message}`);
    process.exitCode = 1;
  } else {
    inserted++;
    console.log(`  inserted lead ${email}`);
  }
}

console.log(
  `\n${WRITE ? "imported" : "would import"} ${inserted}, skipped ${skipped} already present`,
);
