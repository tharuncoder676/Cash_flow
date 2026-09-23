/**
 * Legal page scaffolding.
 *
 * Brief §5F: "Legal and tax wording must be reviewed before publication; the
 * developer should create the page structure but not invent the policies."
 *
 * So each page below is a list of the sections the document must contain, with
 * a prompt describing what belongs there. No policy text is written here. The
 * page renders a visible notice until `status` is set to "approved" and the
 * real copy is supplied, so an unreviewed placeholder cannot quietly go live
 * looking like a binding policy.
 */

export type LegalSection = {
  heading: string;
  /** What the client's adviser needs to supply. Shown only while drafting. */
  prompt: string;
  /** Approved copy. Paragraphs. Empty until legal review is complete. */
  body?: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  status: "awaiting-legal-review" | "approved";
  lastUpdated: string | null;
  sections: LegalSection[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    description:
      "How Cash Flow Mastery collects, uses and stores personal information.",
    status: "awaiting-legal-review",
    lastUpdated: null,
    sections: [
      {
        heading: "Who we are",
        prompt:
          "Legal entity name, trade licence number, registered address and the jurisdiction it is licensed in. Name a data-protection contact.",
      },
      {
        heading: "What we collect",
        prompt:
          "Name, email, company, diagnostic responses, payment records held by Stripe, and site analytics. State what is optional.",
      },
      {
        heading: "Why we collect it",
        prompt:
          "Lawful basis for each purpose: contract performance for enrolment, consent for marketing email, legitimate interest for analytics.",
      },
      {
        heading: "Who we share it with",
        prompt:
          "Named processors: Stripe (payments), the email/CRM platform, video host, analytics provider. Include where each stores data.",
      },
      {
        heading: "International transfers",
        prompt:
          "UAE, EU and any other jurisdictions data reaches, and the safeguards relied on. Confirm against UAE PDPL and GDPR where EU residents enrol.",
      },
      {
        heading: "How long we keep it",
        prompt:
          "Retention period for leads, enrolments and financial records. Financial records normally have a statutory minimum.",
      },
      {
        heading: "Your rights",
        prompt:
          "Access, correction, deletion, withdrawal of consent, complaint route — and the address to exercise them.",
      },
      { heading: "Contact", prompt: "Email address and postal address." },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie notice",
    description: "The cookies this site sets, and how to control them.",
    status: "awaiting-legal-review",
    lastUpdated: null,
    sections: [
      {
        heading: "What we set",
        prompt:
          "Table of every cookie: name, purpose, duration, first or third party. Must be generated from the live site after analytics is installed.",
      },
      {
        heading: "Strictly necessary cookies",
        prompt:
          "Stripe's checkout cookies and any session cookie. These do not need consent but must be disclosed.",
      },
      {
        heading: "Analytics and marketing cookies",
        prompt:
          "Which analytics provider, what it records, and confirmation these load only after consent.",
      },
      {
        heading: "Managing your choices",
        prompt:
          "How to change consent on this site and in the browser. Must match the consent banner actually deployed.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Course terms of sale",
    description:
      "The terms on which a place in the Cash Flow Mastery cohort is sold.",
    status: "awaiting-legal-review",
    lastUpdated: null,
    sections: [
      {
        heading: "The agreement",
        prompt:
          "Who contracts with whom, and confirmation that payment forms acceptance of these terms.",
      },
      {
        heading: "What is supplied",
        prompt:
          "Lessons, live sessions, templates, and the access period. Should match the inclusions listed at checkout.",
      },
      {
        heading: "Price, currency and tax",
        prompt:
          "AED pricing, the founding-five tier, and the VAT position for the selling entity. Confirm with the accountant before publication.",
      },
      {
        heading: "Payment",
        prompt:
          "Payment in full to secure a place; what happens if a payment fails or is reversed.",
      },
      {
        heading: "Scope of the service",
        prompt:
          "Training and group application, not company-specific CFO advice. Should mirror the boundary shown on the sales page.",
      },
      {
        heading: "Changes to dates or format",
        prompt:
          "Right to reschedule a live session, minimum cohort size, and what participants are entitled to if the cohort does not run.",
      },
      {
        heading: "Intellectual property and use of materials",
        prompt:
          "Licence granted over templates and recordings; restrictions on resale and sharing.",
      },
      {
        heading: "Recording and confidentiality",
        prompt:
          "Whether live sessions are recorded, how recordings are used, and what participants agree about each other's information.",
      },
      {
        heading: "Liability",
        prompt: "Limitation of liability, drafted for the governing law below.",
      },
      {
        heading: "Governing law",
        prompt: "Jurisdiction and dispute resolution route.",
      },
    ],
  },
  {
    slug: "refunds",
    title: "Refund and cancellation policy",
    description:
      "When a place can be cancelled and what is refunded.",
    status: "awaiting-legal-review",
    lastUpdated: null,
    sections: [
      {
        heading: "Cancelling before the cohort starts",
        prompt:
          "The notice period and refund amount. The site currently displays a 7-day figure — confirm or replace it, and it must match everywhere.",
      },
      {
        heading: "After the cohort starts",
        prompt:
          "Position once materials and recordings have been accessed.",
      },
      {
        heading: "If we cancel or reschedule",
        prompt: "What participants are entitled to.",
      },
      {
        heading: "Missed live sessions",
        prompt:
          "Confirm that a missed session is not itself grounds for refund, and what is offered instead.",
      },
      {
        heading: "How to request a refund",
        prompt: "Contact route and how long processing takes.",
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Training disclaimer",
    description:
      "The boundary between education and regulated financial advice.",
    status: "awaiting-legal-review",
    lastUpdated: null,
    sections: [
      {
        heading: "Education, not advice",
        prompt:
          "This is training in cash-flow management. It is not accounting, tax, investment or regulated financial advice for any particular business.",
      },
      {
        heading: "No guaranteed outcomes",
        prompt:
          "Results depend on the participant's own business and actions. No representation is made about financial results.",
      },
      {
        heading: "Your own advisers",
        prompt:
          "Participants remain responsible for decisions and should consult their accountant, auditor or regulated adviser.",
      },
      {
        heading: "Relationship to Independent Advisors",
        prompt:
          "How this training relates to, and differs from, the separate fractional CFO engagement.",
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
