# Open items — needed from the client before launch

Everything below is either missing from the brief or explicitly flagged in it
as requiring review. Nothing here has been invented in the build: where a value
was unknown, the site either omits it or shows a neutral placeholder.

Search the codebase for `TO CONFIRM` to find each one in context.

---

## 1. Blocking — the site cannot launch without these

### Cohort dates
- **Where:** `src/content/course.ts` → `cohort.startDate`
- **Now:** `null`, so every date slot reads *"Dates announced to the waitlist first"*.
- **Needed:** Start date, the four live-session dates, and the time of day (GST).
- **Why it matters:** Brief §6 requires the cohort start date to be shown at
  checkout **before** payment. Set `startDate` to an ISO date (`"2026-10-05"`)
  and it appears everywhere automatically.

### VAT treatment
- **Where:** `src/content/course.ts` → `pricing.taxNote`
- **Now:** *"Price shown in UAE Dirhams. VAT treatment confirmed at checkout."*
- **Needed:** From the accountant — is the selling entity VAT-registered? Is
  AED 2,000 inclusive or exclusive of 5% VAT? Does the treatment differ for
  participants outside the UAE?
- **Why it matters:** Brief §5E and §6 both require tax treatment to be stated.
  If VAT is added at checkout rather than included, Stripe Tax must be enabled
  in `src/app/api/checkout/route.ts` — a one-line change, but the price display
  copy has to match.

### Refund policy
- **Where:** `src/content/course.ts` → `pricing.refundPolicy`
- **Now:** A 7-day placeholder, shown at checkout and in the FAQs.
- **Needed:** The real terms, legally reviewed. Whatever is agreed must match
  `/legal/refunds` exactly — the same figure appears in three places.

### Stripe account
- **Needed:** A Stripe account on the UAE entity that will sell the course,
  activated for AED, with the API keys and a webhook endpoint pointed at
  `https://<domain>/api/stripe/webhook` listening for:
  `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
  `checkout.session.async_payment_failed`, `checkout.session.expired`,
  `charge.refunded`.
- **Note:** Stripe is not available to every UAE entity type. If the entity
  cannot be onboarded, the alternative for AED is a local gateway
  (Telr, PayTabs, Network International) — that would replace
  `src/lib/stripe.ts` and the two API routes, roughly a day of work.

### Legal documents
- **Where:** `/legal/privacy`, `/cookies`, `/terms`, `/refunds`, `/disclaimer`
- **Now:** Section scaffolds with a visible "not in force" notice, `noindex`.
- **Needed:** Reviewed copy for each section listed in `src/content/legal.ts`.
  Paste into the `body` array and set `status: "approved"`.

---

## 2. Needed for the cohort to run, not for the site to go live

### Video hosting
Brief §8: *"do not stream large MP4 files directly from ordinary web hosting."*
Nothing is embedded yet. Recommend **Vimeo Pro** or **Mux** — both give
captions, adjustable playback speed and signed private URLs. Decision needed
before lessons are uploaded.

### Email and CRM
- Transactional (receipt, welcome, password reset): Resend or Postmark.
- Marketing (nurture sequence, cohort announcements): MailerLite or ConvertKit.
- The hook is already in place — `src/app/api/leads/route.ts` and the webhook
  both carry a `TODO(phase-two)` at the exact call site.
- Consent is captured and stored with its wording and timestamp
  (`src/lib/leads.ts`), so the list is compliant from day one.

### Analytics
Brief §8 requires lead, checkout-start, purchase and completion events.
Nothing is installed — deliberately, since it must load *after* cookie consent
and the consent banner depends on the approved cookie notice. Recommend Plausible
(no cookie banner needed, simplest compliance) or GA4 if Carl wants Ads
attribution.

### Cookie consent banner
Depends on the approved cookie notice, and on which analytics tool is chosen.

### Logo — a placeholder is currently in use
- **Where:** `src/components/CashFlowMark.tsx`
- **Now:** A placeholder mark drawn in code — a small cash curve that dips and
  recovers, matching the forecast in the hero. It is deliberately not a
  wordmark or a monogram, because inventing either would be inventing brand
  the client has not approved.
- **Needed:** The real Cash Flow Mastery logo as SVG (preferred) or PNG at
  512px or larger, in both a dark-background and light-background version.
- **Swap:** Replace that one file. The mark is used in the header and footer
  lockups and nowhere else.

### Carl's assets
- ~~Portrait photograph~~ — **received.** In use on the About page and the
  home page, graded toward the brand navy. A dedicated social-sharing image
  is still outstanding if a different crop is wanted.
- The welcome video and closing video.
- The final Excel workbook, Cash-Cycle Map, diagnostic worksheet, assumptions
  checklist, weekly meeting agenda, 30-day plan.

### Support inbox
`src/content/course.ts` → `site.contactEmail` currently points at
`carl@independentadvisors.ai`. Confirm, or set up a dedicated course inbox.

---

## 3. Deployment note

The phase-one store writes JSON to `.data/`. **This does not survive on
Vercel or any serverless host with an ephemeral filesystem** — enrolment counts
would reset and seat pricing would be wrong.

Choose one before go-live:

- **Move to Supabase first** (recommended — it is the phase-two direction
  anyway, and only `src/lib/enrolments.ts` and `src/lib/leads.ts` change), or
- **Deploy to a host with a persistent disk** (Railway, Render, a VPS).

Until then, run `npm run build && npm start` on a persistent host for staging.

---

## 4. Decisions the brief leaves open

| Question | Why it matters |
|---|---|
| Are live sessions recorded, and for how long are replays available? | The FAQ answer and the terms both reference a "recording policy" that does not exist yet. |
| Is there a minimum cohort size below which it will not run? | Needs stating in the terms of sale; affects refund exposure. |
| How long does course access last after the cohort ends? | The FAQ says "continues" — vague on purpose until confirmed. |
| Does founding pricing apply to a second cohort? | The waitlist copy currently says it does not. |
