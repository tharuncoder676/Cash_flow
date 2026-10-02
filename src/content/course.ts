/**
 * Cash Flow Mastery — single source of truth for course content.
 *
 * Everything the public site renders comes from this file, so copy can be
 * edited here without touching components.
 *
 * Values marked TO CONFIRM are placeholders the client must supply before
 * launch. They are deliberately not invented — see docs/OPEN-ITEMS.md.
 */

export const site = {
  name: "Cash Flow Mastery",
  domain: "cashflowmastery.co",
  url: "https://www.cashflowmastery.co",
  tagline: "See cash problems 13 weeks before they arrive.",
  parentBrand: {
    name: "Independent Advisors",
    url: "https://www.independentadvisors.ai",
  },
  contactEmail: "carl@independentadvisors.ai", // TO CONFIRM: dedicated course inbox?
} as const;

/**
 * Contact channels, carried over from independentadvisors.ai.
 *
 * Only what a course site needs: a direct email, a phone number, WhatsApp for
 * pre-purchase questions, and the hours that set the reply expectation. The
 * office addresses and the general enquiries inbox are deliberately left out —
 * this is an online programme, not a visit-us business.
 */
export const contact = {
  email: "carl@independentadvisors.ai",
  /** Formatted for reading. */
  phone: "+971 56 178 6444",
  /** Digits only, for tel: and wa.me links. */
  phoneE164: "971561786444",
  hours: "Monday to Friday · 9:00am – 4:00pm GST",
  replyPromise: "Carl replies personally, usually within one working day.",
} as const;

/** A WhatsApp deep link with the message pre-filled for the page it sits on. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${contact.phoneE164}?text=${encodeURIComponent(message)}`;
}

export const promise = {
  belief:
    "Finance is the language of business. You don’t need to become an accountant — but you should understand what your business is telling you.",
  core: "Understand where your cash is going, see cash problems 13 weeks ahead, and leave with a practical cash action plan.",
} as const;

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Pricing & Product Tiers                                            */
/* ------------------------------------------------------------------ */

export const pricing = {
  currency: "USD",
  currencySymbol: "$",
  cohortCapacity: 15, // Total founding cohort: 5 first five + 10 remaining founding places

  // Founding cohort tiers
  foundingFive: {
    name: "First Five Founder Places",
    amount: 550,
    seats: 5,
    label: "First Five Founder Places",
    shortLabel: "Founding Five",
    anchorPrice: 995,
    features: [
      "Limited to the first five participants",
      "Full four-week live cohort programme",
      "Four live sessions with Carl",
      "All lessons, workbooks and templates",
      "Future regular price: USD 995",
    ],
  },
  foundingCohort: {
    name: "Remaining Founding Cohort Places",
    amount: 695,
    seats: 10,
    label: "Remaining Founding Cohort Places",
    shortLabel: "Founding Cohort",
    anchorPrice: 995,
    features: [
      "Limited to the next ten participants",
      "Exactly the same programme and inclusions",
      "Total founding cohort limited to 15 participants",
      "Future regular price: USD 995",
    ],
  },

  // Future products
  futureProducts: {
    regularLive: {
      name: "Regular Live Cohort",
      amount: 995,
      badge: "Standard Live Price",
      description: "This becomes the standard price after the founding cohort.",
      features: [
        "Full four-week live cohort programme",
        "Four live sessions with Carl",
        "All lessons, workbooks and templates",
        "Thirteen weeks of forward visibility",
        "Weekly cash management review rhythm",
      ],
    },
    premiumCohort: {
      name: "Premium Cohort",
      amount: 1795,
      badge: "Strictly 5 per cohort",
      description:
        "Includes the complete live cohort programme plus private 1-on-1 CFO advisory and personalized forecast audit.",
      features: [
        "Complete live cohort programme and all inclusions",
        "A private 60-minute CFO diagnostic session",
        "Personal review of the participant’s 13-week forecast",
        "Written recommendations",
        "A private 45-minute implementation session",
        "Priority course-related email support",
        "Maximum 5 premium participants per cohort",
      ],
    },
    selfPaced: {
      name: "Self-Paced Course",
      amount: 495,
      badge: "Introduced Later",
      description:
        "Introduced later for self-directed learning without live sessions.",
      features: [
        "Recorded lessons",
        "13-week forecast workbook",
        "Templates and exercises",
        "No live sessions",
        "No personal forecast review",
        "No direct access to Carl",
      ],
    },
  },

  // Backward-compatible alias fields
  founding: { amount: 550, seats: 5, label: "First Five Founder Places" },
  standard: { amount: 695, label: "Remaining Founding Cohort Places" },

  taxNote: "Prices shown in US Dollars (USD). VAT treatment confirmed before payment.",
  paymentTerms: "Payment in full secures your place.",
  refundPolicy:
    "Full 100% refund if you withdraw more than 7 days before the cohort start date.",
} as const;

export const cohort = {
  /** TO CONFIRM — Carl to supply real dates. Rendered as-is, never faked. */
  startDate: null as string | null,
  startDateLabel: "Dates announced to the waitlist first",
  durationWeeks: 4,
  accessPeriodMonths: 12,
  liveSession: {
    cadence: "One live group session each week with Carl",
    timezone: "Gulf Standard Time (GST, UTC+4)",
    duration: "60–75 minutes",
  },
  weeklyCommitment:
    "About 2½ hours — roughly 90 minutes of lessons plus one 60–75 minute live session",
  weeklyCommitmentShort: "about 2½ hours a week",
} as const;

/**
 * The printable curriculum, supplied by Carl. Served straight from /public —
 * no email gate, because the brief treats the curriculum as information that
 * helps a buyer qualify themselves, not as a lead magnet. The diagnostic is
 * the lead magnet.
 */
export const curriculumPdf = {
  href: "/cash-flow-mastery-curriculum.pdf",
  pages: 7,
  size: "80 KB",
} as const;

/* ------------------------------------------------------------------ */
/* Curriculum — brief §4                                               */
/* ------------------------------------------------------------------ */

export type Lesson = { title: string };

export type Week = {
  slug: string;
  label: string;
  title: string;
  outcome: string;
  lessons: Lesson[];
  exercise?: string;
  live: string;
};

export const weeks: Week[] = [
  {
    slug: "start-here",
    label: "Start here",
    title: "Set your baseline",
    outcome:
      "You understand the destination, how the course works, and where training ends and bespoke advice begins.",
    lessons: [
      { title: "Welcome from Carl — what you’ll walk away with" },
      { title: "How to use the course, workbook and live sessions" },
      { title: "Baseline Cash Visibility Diagnostic" },
      { title: "Download the workbook and 13-week forecast template" },
    ],
    live: "Orientation and introductions.",
  },
  {
    slug: "week-1",
    label: "Week 1",
    title: "Profit is not cash",
    outcome:
      "You can explain why a profitable or fast-growing business still runs out of cash — and spot the early warning signs in your own numbers.",
    lessons: [
      { title: "The difference between profit and cash" },
      { title: "Can a profitable business still fail?" },
      { title: "Why “cash is king” is more than a slogan" },
      { title: "The cash danger of growing too quickly" },
    ],
    exercise: "Identify the three biggest cash warning signs in your business.",
    live: "Diagnose common profit-versus-cash situations together.",
  },
  {
    slug: "week-2",
    label: "Week 2",
    title: "Find the cash blockage",
    outcome:
      "You can map your operating cash cycle and choose the immediate actions that release or protect cash.",
    lessons: [
      { title: "The cash cycle in plain English" },
      {
        title:
          "Where cash gets trapped — customers, stock, suppliers, overhead",
      },
      { title: "Cash quick wins and cash-generating super tips" },
    ],
    exercise:
      "Complete your Cash-Cycle Map, then pick the top five cash actions for the next 30 days.",
    live: "Carl challenges and sharpens each participant’s action priorities.",
  },
  {
    slug: "week-3",
    label: "Week 3",
    title: "Build your 13-week forecast",
    outcome:
      "You finish the first working version of a practical 13-week cash-flow forecast for your own business.",
    lessons: [
      { title: "Cash budgeting versus cash forecasting" },
      { title: "Why 13 weeks — and how to set the starting cash balance" },
      { title: "Forecast cash receipts from revenue" },
      { title: "Forecast materials, direct costs and supplier payments" },
      { title: "Forecast payroll, overhead and other cash outflows" },
      { title: "Bring it together and identify your low point" },
    ],
    exercise:
      "Build the forecast alongside a guided demonstration, then submit or self-check it.",
    live: "Assumptions, timing errors and weak points reviewed as a group.",
  },
  {
    slug: "week-4",
    label: "Week 4",
    title: "Run the business from cash",
    outcome:
      "You use the forecast as a weekly management tool, with an action and review rhythm that survives a busy month.",
    lessons: [
      { title: "Base, downside and upside scenarios" },
      { title: "The weekly cash meeting and forecast update routine" },
      { title: "Turning a forecast warning into a decision" },
      { title: "The 30-day implementation plan" },
    ],
    exercise: "Complete the final Cash Visibility Diagnostic.",
    live: "Implementation clinic — commitments made out loud.",
  },
  {
    slug: "finish",
    label: "Finish",
    title: "Finish and implement",
    outcome:
      "You leave with a 30-day Cash Action Plan you have already started working.",
    lessons: [
      { title: "Carl’s closing challenge" },
      { title: "Your final 30-day Cash Action Plan" },
      { title: "Completion and feedback survey" },
    ],
    live: "Optional follow-up conversation where appropriate.",
  },
];

/* ------------------------------------------------------------------ */
/* Outcomes — brief §5A “The four outcomes”                            */
/* ------------------------------------------------------------------ */

export const outcomes = [
  {
    n: "01",
    title: "Read your own numbers",
    body: "Tell the difference between a profit problem and a cash problem — in your accounts, not in theory.",
  },
  {
    n: "02",
    title: "Find where cash is trapped",
    body: "Map the operating cash cycle and see exactly which stage is holding your money.",
  },
  {
    n: "03",
    title: "Forecast 13 weeks ahead",
    body: "Build a working forecast that shows your low point before you reach it.",
  },
  {
    n: "04",
    title: "Run a weekly cash rhythm",
    body: "Turn the forecast into a short weekly meeting that drives real decisions.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Suitability — brief §5A “who it is for and who it is not for”       */
/* ------------------------------------------------------------------ */

export const suitability = {
  forYou: [
    "You own or run an SME and the bank balance never quite matches the P&L.",
    "Sales are healthy — or growing fast — and money still feels tight.",
    "You approve payments without a clear view of the next three months.",
    "You want to understand the numbers yourself, not outsource the worry.",
  ],
  notForYou: [
    "You want someone to build and run the forecast for you.",
    "You’re looking for company-specific CFO advice rather than training.",
    "You need help with bookkeeping, tax filing or audit.",
    `You can’t commit ${cohort.weeklyCommitmentShort} for four weeks.`,
  ],
} as const;

/* ------------------------------------------------------------------ */
/* What’s included — brief §5B “Exactly what is included”              */
/* ------------------------------------------------------------------ */

export const included = [
  {
    title: "Four weeks of short lessons",
    body: "Self-paced video, each tied to a stated outcome. Captioned, adjustable speed.",
  },
  {
    title: "Four live sessions with Carl",
    body: "Group application, not a lecture. Bring your own numbers.",
  },
  {
    title: "The 13-week forecast workbook",
    body: "The Excel model Carl builds with fractional CFO clients.",
  },
  {
    title: "Cash Visibility Diagnostic",
    body: "Run it at the start and again at the end, so the change is measurable.",
  },
  {
    title: "Cash-Cycle Map",
    body: "A one-page worksheet that locates the blockage in your operating cycle.",
  },
  {
    title: "Weekly cash meeting agenda",
    body: "The running order that keeps the rhythm going after the cohort ends.",
  },
  {
    title: "Assumptions checklist",
    body: "The questions to ask before you trust a forecast line.",
  },
  {
    title: "30-day implementation plan",
    body: "What you do in the month after the course finishes.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Scope boundary — brief §3, §5B. Stated plainly, never buried.       */
/* ------------------------------------------------------------------ */

export const scopeBoundary = {
  title: "What this is — and what it isn’t",
  body: "Cash Flow Mastery is education and group application. Live sessions teach you to build and use your own forecast, and Carl will challenge your thinking in front of the group. They are not unlimited company-specific CFO advice, and they don’t replace your accountant. If your situation needs bespoke work, that is a separate conversation with Independent Advisors.",
} as const;

/* ------------------------------------------------------------------ */
/* The reframe                                                         */
/*                                                                     */
/* Owner-led SMEs routinely believe they are "bad with numbers". The   */
/* brief asks for a confidence-building tone (§10) and forbids fear-   */
/* based messaging, so the page says plainly that this is a teaching   */
/* gap, not a personal failing — and answers the obvious scepticism    */
/* rather than talking past it.                                        */
/* ------------------------------------------------------------------ */

export const reframe = {
  eyebrow: "Before you decide you're bad at this",
  title: "You are not bad with numbers.",
  body: [
    "Nobody sits an owner down and teaches them to read cash. You were taught to sell, to build, to hire, to survive a bad quarter. The finance arrived as a monthly report written for somebody else, in a language nobody translated.",
    "So when the bank balance contradicts the profit figure, it feels like a personal failing. It isn't. It is a gap in what you were shown — and it closes faster than you would expect, because there are only a handful of ideas that matter.",
  ],
  objections: [
    {
      q: "“I already have an accountant.”",
      a: "Good — keep them. They tell you what happened. This teaches you to see what is about to happen, which is a different job and not one most accountants are engaged to do.",
    },
    {
      q: "“I don't have time for a course.”",
      a: "Ninety minutes a week for four weeks. If cash visibility is costing you one bad decision a quarter, the arithmetic is not close.",
    },
    {
      q: "“I'm not a numbers person.”",
      a: "There is no such thing. There are people who were shown how to read a cash cycle and people who were not. Four weeks moves you from the second group to the first.",
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Carl — brief §5C                                                    */
/* ------------------------------------------------------------------ */

export const carl = {
  name: "Carl Lewis",
  credentials: "MBA, FCMA, CGMA",
  role: "Fractional CFO and founder, Independent Advisors",
  linkedin: "https://www.linkedin.com/in/carl-lewis-mba-fcma-cgma-1a516aa",
  bio: [
    "Carl has spent his career on the owner’s side of the table — as a fractional CFO to SMEs across the UAE and GCC, and before that in senior finance roles where the numbers had to hold up under pressure.",
    "He is a Fellow of the Chartered Institute of Management Accountants and holds the CGMA designation alongside an MBA. But the qualification that matters most here is the everyday one: he has watched profitable, well-run businesses come close to the edge because nobody could see the cash coming.",
    "His view is straightforward. Owners don’t need to become accountants. They need to understand what the business is telling them, and they need a forecast they trust enough to make decisions from. That is what this course teaches.",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* FAQs — brief §5E requires all of these topics covered               */
/* ------------------------------------------------------------------ */

export const faqs = [
  {
    q: "Do I need a finance background?",
    a: "No. The course is written in plain English for owners and managing directors. If you can read your own bank statement and sales figures, you have enough to start. Anything technical is explained as it comes up.",
  },
  {
    q: "How much time does it take each week?",
    a: `${cohort.weeklyCommitment}. Lessons are short and self-paced, so you can watch them in the gaps. The live session is the part worth protecting in your diary.`,
  },
  {
    q: "When are the live sessions?",
    a: `${cohort.liveSession.cadence}, ${cohort.liveSession.duration}, run in ${cohort.liveSession.timezone}. Exact dates and times are confirmed by email before the cohort starts.`,
  },
  {
    q: "What if I miss a live session?",
    a: "Sessions are recorded and added to your course area, subject to the recording policy participants agree at the start. You can also send your question ahead of time and Carl will cover it.",
  },
  {
    q: "How long do I have access?",
    a: "You have full access to the online lessons and replays for 12 months from the cohort start date. All downloaded templates, exercises and the 13-week forecast workbook are yours to keep and reuse indefinitely.",
  },
  {
    q: "What templates do I get to keep?",
    a: "The 13-week cash-flow forecast workbook, the Cash-Cycle Map, the Cash Visibility Diagnostic, the assumptions checklist, the weekly cash meeting agenda and the 30-day implementation plan. They are yours to keep and reuse.",
  },
  {
    q: "Will my business information stay confidential?",
    a: "You choose what you share. Live sessions are group application sessions, and every participant accepts a strict confidentiality obligation in the course terms: what is discussed in the room stays in the room. Carl and Independent Advisors treat anything you submit as confidential, and the privacy policy sets out how it is held and protected.",
  },
  {
    q: "Is this CFO advice for my specific company?",
    a: scopeBoundary.body,
  },
  {
    q: "What currency is the price in, and is VAT included?",
    a: `Prices are shown in US Dollars (USD). The first five founder places are USD 550, followed by USD 695 for the remaining ten founding cohort places (future regular live cohorts: USD 995; premium cohort: USD 1,795; self-paced course: USD 495). ${pricing.taxNote} The full breakdown appears before you pay.`,
  },
  {
    q: "What is the refund policy?",
    a: `${pricing.refundPolicy} Full terms are available in our refund policy and course terms of sale.`,
  },
  {
    q: "How do I get support?",
    a: `Email ${contact.email}, call ${contact.phone}, or message the same number on WhatsApp. ${contact.replyPromise} Office hours are ${contact.hours}, and technical access problems are handled the same day wherever possible.`,
  },
  {
    q: "What happens if the cohort is full?",
    a: "Join the waitlist and you’ll be offered a place in the next cohort before it opens publicly. Founding pricing applies to this cohort only.",
  },
] as const;
