# Cash Flow Mastery

Marketing site and Stripe checkout for the Cash Flow Mastery founding cohort —
a four-week blended programme for owner-led SMEs, taught by Carl Lewis
(MBA, FCMA, CGMA) of [Independent Advisors](https://www.independentadvisors.ai).

Built against the client brief in [`docs/Cash Flow Mastery.docx`](docs/).

---

## Stack

| Concern      | Choice                                    | Why |
|--------------|-------------------------------------------|-----|
| Framework    | Next.js 16 (App Router) + React 19        | Server routes are required to hold the Stripe secret key and verify webhooks |
| Styling      | Tailwind v4, tokens in `src/app/globals.css` | Palette and type inherited from independentadvisors.ai |
| Payments     | Stripe Embedded Checkout                  | PCI stays with Stripe; the buyer never leaves the domain |
| Storage      | JSON files under `.data/` (phase one)     | One cohort of fifteen; see [docs/PHASE-TWO.md](docs/PHASE-TWO.md) |
| Fonts        | Fraunces (display), Inter (body), JetBrains Mono (labels) | Self-hosted via `next/font` |

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in the Stripe keys
npm run dev                  # http://localhost:3000
```

The site runs **without** Stripe keys — the checkout degrades to the waitlist,
so the marketing pages can be reviewed before the payment account exists.

## Stripe setup

1. Copy the test keys from <https://dashboard.stripe.com/apikeys> into
   `.env.local` (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
2. Forward webhooks to the local server and paste the printed signing secret
   into `STRIPE_WEBHOOK_SECRET`:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Pay with test card `4242 4242 4242 4242`, any future expiry, any CVC.

**Never commit real keys.** `.env.local` is gitignored.

### How enrolment works

```
/enrol  ──POST /api/checkout──▶  Stripe Checkout Session (price set server-side)
                                          │
                         buyer pays in Stripe's iframe
                                          │
        ┌─────────────────────────────────┴──────────────────────────┐
        ▼                                                            ▼
  redirect to /enrol/success                        POST /api/stripe/webhook
  (reads and reports only)                          (verifies signature,
                                                     writes the enrolment)
```

The webhook is the **only** thing that grants a place. The success page reads
what the webhook wrote — so a forged `session_id`, an abandoned checkout or a
failed payment produces no enrolment. This is acceptance test §12 in the brief.

Prices are resolved server-side from the number of places already sold
(`src/lib/pricing.ts`), so the client cannot choose what to pay.

## Layout

```
src/
  app/
    page.tsx              Home
    course/               Sales page
    enrol/                Checkout + success
    diagnostic/           Free Cash Visibility Diagnostic (lead magnet)
    about/ faq/ waitlist/ learn/
    legal/[slug]/         Policy scaffolds — structure only, see below
    api/
      checkout/           Creates the Checkout Session
      stripe/webhook/     Grants access on verified payment
      leads/              Diagnostic + waitlist capture with consent
  components/
    ForecastModel.tsx     Interactive 13-week forecast (hero)
    CashCycleDiagram.tsx  Operating cash cycle, drawn to scale
    DiagnosticForm.tsx    Ten-question assessment with scoring
    primitives.tsx        Buttons, sections, eyebrows
  content/
    course.ts             All course copy, pricing, FAQs — single source of truth
    diagnostic.ts         Questions, scoring bands
    legal.ts              Required sections per policy document
  lib/
    pricing.ts  stripe.ts  enrolments.ts  leads.ts
```

**To change copy, edit `src/content/course.ts`.** Pages read from it; nothing
is hardcoded in components.

## Legal pages are deliberately unfinished

Per brief §5F, the developer creates the structure but does not invent the
policies. `/legal/*` renders the section headings each document must cover,
with a visible "awaiting legal review — not in force" notice, and is excluded
from search engines until `status` is set to `approved` in
`src/content/legal.ts`.

**Do not launch without replacing these with reviewed copy.**

## Before launch

See [docs/OPEN-ITEMS.md](docs/OPEN-ITEMS.md) for everything still needed from
the client — cohort dates, VAT treatment, refund terms, the Stripe entity, and
the video host.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
