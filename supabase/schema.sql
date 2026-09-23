-- Cash Flow Mastery — database schema
--
-- Run this once, in the Supabase dashboard under SQL Editor, against the
-- project that will hold live data. It is safe to run more than once.
--
-- Design notes
--
--   * Both tables are written only by the website's server routes, using the
--     service-role key. Row Level Security is ON and NO policies are created,
--     so the public "anon" key can read nothing even if it leaks. The
--     service-role key bypasses RLS by design, which is why it must never be
--     exposed to the browser or committed to the repository.
--
--   * Idempotency is enforced by the database, not by application code:
--     - enrolments.stripe_session_id is UNIQUE, so a retried Stripe webhook
--       cannot consume a second place.
--     - leads (email, source) is UNIQUE, so re-submitting a form refreshes
--       the row rather than creating a duplicate for Carl to clean up.
--
--   * Timestamps are timestamptz. Everything is stored in UTC and rendered
--     in Gulf Standard Time by the application.

-- ---------------------------------------------------------------------------
-- Enrolments — paid places on the cohort
-- ---------------------------------------------------------------------------

create table if not exists public.enrolments (
  id                       text primary key,
  email                    text        not null,
  name                     text,
  company                  text,
  tier                     text        not null check (tier in ('founding', 'standard')),
  -- Amount actually captured, in the smallest currency unit (fils, cents).
  amount_minor             integer     not null check (amount_minor >= 0),
  currency                 text        not null,
  stripe_session_id        text        not null unique,
  stripe_payment_intent_id text,
  created_at               timestamptz not null default now(),
  -- Set when the payment is fully refunded. The row is kept for the audit
  -- trail, but the place no longer counts and access is withdrawn.
  revoked_at               timestamptz
);

-- countEnrolments() runs on nearly every page render: it counts rows where
-- revoked_at is null. A partial index keeps that a cheap lookup.
create index if not exists enrolments_active_idx
  on public.enrolments (created_at)
  where revoked_at is null;

-- revokeEnrolmentByPaymentIntent() looks up by payment intent on refund.
create index if not exists enrolments_payment_intent_idx
  on public.enrolments (stripe_payment_intent_id);

-- ---------------------------------------------------------------------------
-- Leads — diagnostic results, waitlist sign-ups, forecast captures
-- ---------------------------------------------------------------------------

create table if not exists public.leads (
  -- Defaulted in the database, not supplied by the application: the lead
  -- upsert must not overwrite the id of a row it is refreshing.
  id                text primary key default ('lead_' || replace(gen_random_uuid()::text, '-', '')),
  email             text        not null,
  name              text,
  company           text,
  source            text        not null check (source in ('diagnostic', 'waitlist', 'forecast')),
  -- Explicit opt-in. Never defaulted to true; the exact wording shown to the
  -- person is stored alongside it so consent can be evidenced later.
  marketing_consent boolean     not null default false,
  consent_text      text        not null,
  -- What the person was looking at when they handed over their email — for a
  -- forecast lead, the figures they entered and the gap those produced.
  context           text,
  created_at        timestamptz not null default now(),
  unique (email, source)
);

create index if not exists leads_source_idx on public.leads (source);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ---------------------------------------------------------------------------
-- Lock both tables down
-- ---------------------------------------------------------------------------

alter table public.enrolments enable row level security;
alter table public.leads      enable row level security;

-- Deliberately no policies. With RLS enabled and no policy granting access,
-- the anon and authenticated roles can do nothing at all. Only the
-- service-role key — held by the server, never by the browser — can read or
-- write these tables.

-- Revoke the default grants Supabase gives the API roles, so a future policy
-- added by mistake still cannot expose payment data without a second step.
revoke all on public.enrolments from anon, authenticated;
revoke all on public.leads      from anon, authenticated;
