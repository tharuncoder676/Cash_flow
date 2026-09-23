# Design notes

## Relationship to independentadvisors.ai

The brief asks to reuse the existing Cash Flow Mastery brand. Since the two
properties share an owner and an audience, Cash Flow Mastery inherits
Independent Advisors' **palette and typography** exactly, so the two read as one
family — and departs from it in **structure**, so it does not read as a copy.

### Inherited unchanged

| Token | Value | Role |
|---|---|---|
| Ink | `#050E24` `#0A1631` `#0B1E45` | Backgrounds, display text |
| Slate | `#425073` | Body text on light |
| Paper | `#FBF8F1` `#F5EFE2` `#EBE2CE` | Grounds |
| Gold | `#D4A24C` `#A87A2A` `#E8BC6C` | Accent |
| Display | Fraunces (Playfair Display fallback) | Headings, tight negative tracking |
| Body | Inter | Prose |
| Labels | JetBrains Mono, uppercase, ~0.16em tracking | Eyebrows and metadata |
| Buttons | 2px radius, uppercase, ~0.14em tracking | Carried over verbatim |

### Deliberately different

| independentadvisors.ai | Cash Flow Mastery |
|---|---|
| Single page, hash anchors (`/#services`, `/#about`) | Multi-page routes with real URLs — a course needs indexable sales and FAQ pages |
| Centred two-tone display statement as hero | Asymmetric split: copy left, a working forecast right |
| Stacked service cards | Numbered four-week spine; hairline-divided grids |
| Decorative section imagery | Data diagrams only — no photography anywhere |
| Corporate service tone | Second-person instructional tone |

## Two accessibility-driven divergences

Two values had to change from the parent brand to meet the brief's contrast
requirement (§8):

- **`gold-700` is `#7A5617`, not `#8D651F`.** The brand gold `#A87A2A` measures
  3.3–3.7:1 on the cream grounds — fine for the large display text it is used
  for on independentadvisors.ai (3:1 threshold), but failing for 10–11px
  eyebrows. Small gold text uses `gold-700` (5.8–6.5:1); large italic display
  text keeps the true brand gold.
- **`ink-300` is `#5B6788`.** The lighter original measured 3.8:1.

Verified: 788 text nodes across 9 pages, zero WCAG AA failures.

## Why there is no photography

Brief §10 rules out institutional finance imagery, stock-market visuals and
fear-based messaging — which removes almost every stock image a finance course
would normally use. Rather than substitute weaker decoration, the visual
interest comes from the subject itself:

- **`ForecastModel.tsx`** — an interactive 13-week forecast. Three sliders
  (collection days, supplier days, growth) drive a real weekly cash model. At
  the defaults the business is profitable and still crosses zero at week 9 when
  the quarterly VAT payment lands; shortening collections to 30 days keeps it
  positive. It is the course's core argument, demonstrable in ten seconds, and
  it is labelled as an illustration rather than advice.
- **`CashCycleDiagram.tsx`** — the operating cash cycle drawn to scale. The
  70-day gap between paying suppliers and being paid is the Week 2 lesson.

The two are numerically consistent: the forecast model's `STOCK_DAYS` and
supplier timing produce the same 70-day gap the diagram draws.

## What the brief forbids, and where that shows

- No fabricated testimonials, results or client logos — **there are none.**
- No countdown timers or scarcity devices — the capacity bar on the sales page
  shows the real number of places taken and nothing else. No urgency copy.
- No guarantees — the refund terms are stated plainly instead.
- The scope boundary (training, not CFO advice) appears on the home page, the
  sales page, the About page and the checkout — not buried in the terms.

## Motion

One pattern: `data-reveal` fades content up as it enters view
(`Reveal.tsx`). CSS hides those elements only once the script runs, so with
JavaScript disabled the page renders fully visible. `prefers-reduced-motion`
disables it, along with every other transition, via `globals.css`.
