# Architecture options

Brief §9 asks for two costed options: a fast founding-cohort build, and the
scalable architecture that follows once demand is proven.

> **On the figures below:** these are indicative third-party platform costs at
> the time of writing, for budgeting only. Every vendor changes pricing; confirm
> current rates before quoting the client. Developer time and fees are a
> commercial matter for your own quotation and are not estimated here.

---

## Option A — Fast founding-cohort build *(what is built)*

Sell the cohort properly; deliver it with the lightest tooling that works for
fifteen people.

**Scope:** home, sales page, About Carl, free diagnostic with lead capture,
FAQs, waitlist, legal scaffolds, Stripe checkout, webhook-driven enrolment,
capacity control, SEO and analytics hooks.

**Delivery:** Zoom or Google Meet for live sessions; lessons and templates sent
by email, or hosted on Vimeo with an unlisted link. No learner login.

| | |
|---|---|
| **Recurring** | Hosting free–$20/mo · domain ~$15/yr · Vimeo Pro ~$20/mo · email platform free–$25/mo |
| **Transaction fees** | Stripe UAE, indicatively ~2.9% + AED 1 domestic, higher for international cards — confirm the rate on the actual account. On AED 2,000 that is roughly AED 60 per place. |
| **Maintenance** | Dependency updates ~quarterly; content edits are one file (`src/content/course.ts`) |
| **Data ownership** | Complete. Leads and enrolments are yours; Stripe holds only payment records. |
| **Integration limits** | No progress tracking, no gated downloads, no learner login. Fine for one cohort, poor past ~30 people. |
| **Exit** | Nothing to exit. Standard Next.js, runs on any Node host. |

**Outstanding before this can go live:** see [OPEN-ITEMS.md](OPEN-ITEMS.md).

---

## Option B — Scalable phase two

Add the learner area once the pilot proves demand. Everything below plugs into
seams that already exist in the code.

### What gets added

**1. Authentication and enrolment records — Supabase**
Replace the two JSON-file modules with Postgres tables. This is the only
storage the codebase touches, by design:

- `src/lib/enrolments.ts` → `enrolments` table
- `src/lib/leads.ts` → `leads` table

The function signatures stay identical, so no page or route changes. Suggested
schema:

```sql
create table enrolments (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references auth.users,
  email                  text not null,
  name                   text,
  tier                   text not null check (tier in ('founding','standard')),
  amount_minor           integer not null,
  currency               text not null default 'AED',
  stripe_session_id      text not null unique,   -- idempotency for webhook retries
  stripe_payment_intent  text,
  cohort_id              uuid references cohorts,
  created_at             timestamptz not null default now()
);

create table lesson_progress (
  user_id      uuid references auth.users,
  lesson_slug  text not null,
  completed_at timestamptz,
  primary key (user_id, lesson_slug)
);
```

Row-level security keyed on `auth.uid()` gives "access only the course you
purchased" (brief §12) without application-level checks.

**2. Learner area** — `/learn` already exists as a shell. Becomes:
dashboard with current-week status and continue-learning button; lesson
template (video, outcome, summary, exercise, downloads, mark-complete,
prev/next); resource library with signed download URLs; live-session panel
with dates and joining links.

**3. Video** — Vimeo or Mux embeds with signed playback, captions and speed
control. Never MP4 from origin (brief §8).

**4. Email automation** — welcome and activation on `checkout.session.completed`
(the `TODO(phase-two)` in the webhook marks the spot), plus the nurture
sequence from the diagnostic.

**5. Abandoned checkout** — `checkout.session.expired` is already handled and
logged; add the follow-up email, subject to consent.

| | |
|---|---|
| **Recurring** | Option A costs plus Supabase ~$25/mo (free tier is enough to start) · Mux usage-based or Vimeo ~$20–65/mo · transactional email ~$20/mo |
| **Transaction fees** | Unchanged |
| **Maintenance** | Higher — auth, database backups, and access bugs are now yours. Budget a monthly retainer. |
| **Data ownership** | Complete, and better than Option A: learner progress and outcomes are queryable, which is what proves the programme works. |
| **Integration limits** | Few. Supabase is plain Postgres — export any time. |
| **Exit** | `pg_dump` for data; video files re-uploadable elsewhere. No proprietary course format. |

---

## Option C — Hosted LMS, for comparison

Worth knowing what is being traded away. Thinkific or Teachable (~$50–200/mo)
gives auth, video, progress, certificates and a mobile app on day one, with no
maintenance burden — this is closest to the brief's instruction not to
custom-build auth, video or progress.

Against it: learners leave the domain, branding is constrained to the
platform's themes, the learner relationship is mediated by a third party, data
export is limited, and cost scales with students rather than with usage.

**Recommendation:** Option A now. Revisit A → B versus A → C after the founding
cohort, using what the pilot shows about how much delivery polish actually
matters to these buyers. The decision is cheap to defer because the public site
and the payment flow are identical under all three.

---

## Migration notes (A → B)

1. Create the Supabase project and the tables above.
2. Rewrite `src/lib/enrolments.ts` and `src/lib/leads.ts` against
   `@supabase/supabase-js`, keeping the exported function signatures.
3. Import the existing `.data/*.json` rows.
4. Add `@supabase/ssr` middleware for session handling.
5. Build out `/learn`.

Steps 1–3 are the whole data migration. Nothing else in the codebase reads or
writes storage — that constraint was the point of the seam.
