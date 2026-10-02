/**
 * Cash Flow Mastery — Complete Legal Policy Pack
 *
 * Sourced directly from Cash_Flow_Mastery_Website_Policy_Pack.docx (Version 1.0 | 2 October 2026).
 * Prepared for Independent Advisors FZE (Sharjah Publishing City Free Zone, Sharjah, UAE).
 */

export type LegalSection = {
  heading: string;
  prompt?: string;
  body: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  status: "approved" | "awaiting-legal-review";
  version: string;
  lastUpdated: string;
  effectiveDate: string;
  sections: LegalSection[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: "terms",
    title: "Course Terms of Sale",
    shortTitle: "Terms of Sale",
    description:
      "The terms and conditions on which a place in the Cash Flow Mastery cohort is purchased and delivered.",
    status: "approved",
    version: "1.0",
    lastUpdated: "2 October 2026",
    effectiveDate: "2 October 2026",
    sections: [
      {
        heading: "Who we are",
        body: [
          "Cash Flow Mastery is a professional training programme supplied by Independent Advisors FZE, registered and licensed in Sharjah Publishing City Free Zone, Sharjah, United Arab Emirates.",
          "Cash Flow Mastery is a programme trading name and is not a separate legal entity. References to “we”, “us” and “our” mean Independent Advisors FZE. References to “you” mean the purchaser and, where different, the individual participant attending the programme.",
        ],
      },
      {
        heading: "The programme",
        body: [
          "The founding programme is a four-week blended training course for SME owners and managing directors. It includes short self-paced lessons, four scheduled live group sessions with Carl Lewis, the proprietary 13-week cash-flow forecast workbook, and the supporting templates listed on the checkout page at the date of purchase.",
          "The programme provides financial management education and group application. It does not constitute bookkeeping, audit, tax filing, legal advice, regulated financial advice, or an unlimited fractional-CFO service. The Training Disclaimer forms an integral part of these terms.",
        ],
      },
      {
        heading: "Price, VAT and payment",
        body: [
          "Prices are stated in US Dollars (USD). The checkout page clearly displays the applicable price and confirms any UAE VAT or local tax position before payment is confirmed.",
          "Payment is due in full through our secure payment gateway (Stripe) unless another written arrangement has been agreed in advance. A place in the cohort is secured only upon confirmation of successful payment by Stripe.",
          "The First Five Founder Places price (USD 550) applies strictly to the first five completed and accepted payments for the founding cohort. Following the purchase of the first five places, the Remaining Founding Cohort Places are priced at USD 695 (total founding cohort limited to 15 participants). Future live cohort standard pricing is USD 995. Initiating checkout or submitting an enquiry does not reserve a seat or guarantee a price tier.",
        ],
      },
      {
        heading: "Eligibility and purchaser information",
        body: [
          "Purchasers must provide accurate, complete contact and billing information during checkout.",
          "Where an organisation purchases a place on behalf of an employee or executive, the organisation remains responsible for full payment, and the individual participant is required to comply with all confidentiality, conduct, and intellectual property provisions.",
        ],
      },
      {
        heading: "Dates, delivery and changes",
        body: [
          "Confirmed cohort start dates, live session timings, and time zones (Gulf Standard Time, UTC+4) are displayed prior to enrolment and reconfirmed in the orientation email.",
          "We reserve the right to make reasonable adjustments to session dates, timing, delivery platform, or lesson sequencing where necessary, provided such adjustments do not materially diminish the quality or scope of the programme. If a live session must be rescheduled, we will provide as much advance notice as reasonably practical alongside access to a complete recording.",
          "We reserve the right to postpone or cancel a cohort if the minimum viable participant threshold is not met or if circumstances beyond our reasonable control prevent delivery. In such cases, the remedies specified in our Refund and Cancellation Policy apply.",
        ],
      },
      {
        heading: "Access and technical requirements",
        body: [
          "Course access is personal to the registered participant and may not be shared or transferred without our written consent.",
          "Access to online video lessons, materials, and live session replays continues for 12 months from the cohort start date. Downloaded workbooks and templates may be retained and reused indefinitely for internal business cash-flow management.",
          "Participants are responsible for securing a reliable internet connection, compatible hardware, and up-to-date web browser.",
          "We may temporarily suspend platform access for necessary maintenance or security audits, and will restore legitimate access promptly.",
        ],
      },
      {
        heading: "Live sessions, recordings and confidentiality",
        body: [
          "Live group sessions may be recorded for the exclusive benefit of enrolled cohort participants. Participants will be notified before recording commences.",
          "Participants are strictly prohibited from creating their own audio or video recordings without prior written authorisation.",
          "Participants agree to maintain the strict confidentiality of all commercial and financial information shared by fellow participants during group discussions and exercises. Information shared inside the room must not be published, disclosed, or used outside the programme.",
          "You retain full discretion over the data you share. Do not disclose sensitive personal passwords, bank credentials, or confidential third-party data not required for the learning exercises.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "Independent Advisors FZE and its licensors retain all intellectual property rights, copyright, and title in the lessons, video recordings, 13-week forecast models, diagnostic tools, templates, branding, and written guides.",
          "Upon receipt of full payment, you are granted a non-exclusive, non-transferable, revocable licence to use the course materials solely for your own individual learning and your business's internal cash-management operations.",
          "You may not sell, sublicense, publicly broadcast, publish, distribute, or adapt the materials to provide competing training, advisory, or consulting services to third parties. Internal sharing of a completed forecast model with your company’s internal team or retained accountants is permitted.",
        ],
      },
      {
        heading: "Participant conduct",
        body: [
          "We reserve the right to remove any participant who engages in disruptive, harassing, or unlawful behaviour, breaches confidentiality obligations, or compromises system security.",
          "Except where mandatory consumer protection laws dictate otherwise, dismissal due to serious misconduct does not entitle the participant to a refund.",
        ],
      },
      {
        heading: "Outcomes and responsibility",
        body: [
          "Cash Flow Mastery is structured to provide financial education, practical frameworks, and forecasting discipline. Results depend entirely upon the accuracy of your financial data, individual business dynamics, and subsequent commercial decisions.",
          "We make no representations or guarantees regarding specific revenue, profit increases, debt recovery, bank facility approvals, or solvency outcomes. You remain entirely responsible for all operational, financial, and strategic decisions.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "Nothing in these terms limits or excludes liability that cannot lawfully be limited under the laws of the United Arab Emirates.",
          "Subject to the foregoing, our total aggregate liability arising out of or in connection with the programme, whether in contract, tort (including negligence), or otherwise, is strictly capped at the total fee paid by you for the programme place.",
          "We shall not be liable for any indirect, special, incidental, or consequential losses, including loss of profits, commercial opportunities, loss of data, or decisions made on incomplete data.",
        ],
      },
      {
        heading: "Refunds, complaints and contact",
        body: [
          "Refunds and cancellations are administered in accordance with our Refund and Cancellation Policy.",
          "Questions, access issues, or formal complaints should be directed to carl@independentadvisors.ai. We acknowledge written enquiries within two business days and provide considered resolutions within ten business days.",
        ],
      },
      {
        heading: "Governing law and jurisdiction",
        body: [
          "These terms of sale are governed by and construed in accordance with the federal laws of the United Arab Emirates and the applicable commercial laws of Sharjah.",
          "The competent courts of the United Arab Emirates shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these terms, subject to any mandatory consumer conciliation procedures.",
        ],
      },
    ],
  },
  {
    slug: "refunds",
    title: "Refund and Cancellation Policy",
    shortTitle: "Refunds",
    description:
      "Clear rules on when cohort enrolments can be cancelled, transferred, or refunded.",
    status: "approved",
    version: "1.0",
    lastUpdated: "2 October 2026",
    effectiveDate: "2 October 2026",
    sections: [
      {
        heading: "Cancellation more than seven days before cohort start",
        body: [
          "You are entitled to a full 100% refund if we receive your written cancellation notice more than seven (7) calendar days before the officially published cohort start date.",
          "To request a refund, email carl@independentadvisors.ai from the email address used during checkout, citing the purchaser name and Stripe transaction reference.",
        ],
      },
      {
        heading: "Cancellation seven days or less before cohort start",
        body: [
          "If your written cancellation is received seven (7) calendar days or less prior to the cohort start date, no automatic cash refund is provided, as course seat allocation, platform provisioning, and cohort size caps are locked.",
          "At our sole discretion, we may offer you a transfer to the subsequent live cohort, a credit towards future advisory, or the substitution of a qualified colleague from the same organisation.",
        ],
      },
      {
        heading: "After programme commencement or resource access",
        body: [
          "Once the cohort has officially started, or once substantial digital course materials and the 13-week workbook have been accessed or downloaded, course fees are non-refundable.",
          "This policy does not restrict statutory remedies available under applicable UAE consumer protection regulations where a service was materially misdescribed or failed to be delivered.",
        ],
      },
      {
        heading: "Missed live sessions",
        body: [
          "Inability to attend a scheduled live session does not constitute grounds for a full or partial refund.",
          "All live sessions are recorded and made available inside the private course portal for 12 months. Participants may also submit questions in advance of live sessions for Carl Lewis to review during the clinic.",
        ],
      },
      {
        heading: "Transfers and substitutions",
        body: [
          "Requests to transfer to a later cohort or substitute an alternative participant from the same organisation must be submitted in writing at least 48 hours prior to the cohort start date.",
          "Transfers or substitutions may not be resold, assigned, or transferred to third-party entities.",
        ],
      },
      {
        heading: "If we postpone a cohort",
        body: [
          "If we postpone the cohort start date by more than fourteen (14) calendar days, you may elect to accept the revised schedule, transfer to a later cohort, or request an immediate 100% refund.",
          "If an individual live session is rescheduled due to unforeseen circumstances, a replacement live session and full replay will be provided without triggering an automatic total course refund.",
        ],
      },
      {
        heading: "If we cancel a cohort",
        body: [
          "If Independent Advisors FZE cancels a cohort without offering a viable replacement schedule, all course fees paid will be refunded in full.",
          "We are not liable for incidental or third-party costs, such as travel, accommodations, or lost time.",
        ],
      },
      {
        heading: "Refund processing procedure",
        body: [
          "Approved refunds are credited directly to the original payment card or method via Stripe.",
          "We initiate refund requests with Stripe promptly and aim to complete processing within ten (10) working days. The time for funds to appear on your statement depends on your card issuer.",
        ],
      },
      {
        heading: "Payment disputes and queries",
        body: [
          "If you have any billing questions or concerns, please contact us directly at carl@independentadvisors.ai before initiating a card dispute or chargeback so we can resolve the matter swiftly.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    shortTitle: "Privacy",
    description:
      "How Independent Advisors FZE collects, protects, processes, and retains personal data for Cash Flow Mastery.",
    status: "approved",
    version: "1.0",
    lastUpdated: "2 October 2026",
    effectiveDate: "2 October 2026",
    sections: [
      {
        heading: "Data Controller and Contact Information",
        body: [
          "Independent Advisors FZE (Sharjah Publishing City Free Zone, Sharjah, United Arab Emirates) acts as the Data Controller for personal data processed through the Cash Flow Mastery website, diagnostic tool, waitlist, and learning platform.",
          "Privacy Contact: Carl Lewis, carl@independentadvisors.ai.",
          "Cash Flow Mastery is a training programme owned and operated by Independent Advisors FZE.",
        ],
      },
      {
        heading: "Personal data we collect",
        body: [
          "• Identity and Contact Data: Full name, business email address, phone/WhatsApp number, job title, and company name.",
          "• Diagnostic Data: Responses and scores submitted through the Cash Visibility Diagnostic.",
          "• Enrolment & Attendance Data: Course registration details, live session attendance records, and correspondence.",
          "• Billing & Transaction Data: Invoice records, payment status, and order history. Note: Payment card data is processed directly by Stripe inside their secure PCI-compliant infrastructure and is never stored on our servers.",
          "• Technical & Usage Data: IP address, device type, browser specifications, page view interactions, and security logs.",
          "• Group Discussion Content: Information and case examples you choose to share in live sessions and exercises.",
          "• Marketing & Consent Preferences: Communication preferences and opt-in/opt-out records.",
        ],
      },
      {
        heading: "Purposes and Lawful Bases for Processing",
        body: [
          "We process personal data in compliance with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL) under the following lawful bases:",
          "• Providing Diagnostic Results & Workbooks: Processed upon your explicit request.",
          "• Processing Enrolment & Cohort Access: Necessary for the performance of our contract with you.",
          "• Delivering Lessons, Live Sessions & Support: Necessary for contract execution and educational delivery.",
          "• Operational Course Notifications: Necessary for contract fulfilment and scheduling.",
          "• Optional Marketing Communications: Processed solely where you have provided explicit, un-ticked consent (which may be withdrawn at any time).",
          "• Platform Security & Quality Improvement: Legitimate business interests in ensuring network security and service reliability.",
          "• Statutory Accounting & Tax Compliance: Necessary for compliance with UAE commercial and tax regulations.",
        ],
      },
      {
        heading: "Diagnostic tool and waitlist choices",
        body: [
          "You are free to complete the on-screen Cash Visibility Diagnostic and review your results without entering an email address.",
          "If you request an emailed copy of your diagnostic report or choose to join the cohort waitlist, your contact details are used strictly for that specific purpose. We do not bundle waitlist requests with unsolicited marketing.",
        ],
      },
      {
        heading: "Live session recordings and privacy",
        body: [
          "Where live group sessions are recorded, all attendees are notified prior to recording. Recordings may capture video, voice, names, and chat comments.",
          "Replays are shared exclusively within the secure cohort member portal for 12 months. Recordings are never published publicly or shared with third parties without separate written consent.",
        ],
      },
      {
        heading: "Third-party service providers",
        body: [
          "We engage reputable third-party service providers to assist in delivering our services:",
          "• Stripe: PCI-DSS compliant payment processing and fraud prevention.",
          "• Email & CRM Infrastructure: Transactional course delivery and waitlist notifications.",
          "• Secure Video Meeting Systems: Encrypted live cohort session hosting.",
          "• Cloud Hosting Infrastructure: Secure web application hosting and DDoS protection.",
          "We do not sell, rent, or trade your personal data to any third party for commercial marketing.",
        ],
      },
      {
        heading: "International data transfers",
        body: [
          "Where data is transferred outside the UAE by our international technology providers (e.g. Stripe cloud infrastructure), we ensure appropriate contractual safeguards and encryption standards in accordance with UAE PDPL requirements.",
        ],
      },
      {
        heading: "Data retention schedule",
        body: [
          "• Waitlist & Marketing Leads: Retained until consent is withdrawn, or after 24 months of continuous inactivity.",
          "• Diagnostic Submissions without Enrolment: Retained for 12 months.",
          "• Course Enrolment & Progress Records: Retained for the 12-month access period plus 12 months for alumni record-keeping.",
          "• Live Session Replays: Retained in the cohort portal for 12 months, after which they are permanently archived or deleted.",
          "• Financial & Tax Invoices: Retained for the mandatory statutory period required under UAE commercial and tax law (minimum 5 years).",
        ],
      },
      {
        heading: "Your data protection rights",
        body: [
          "Under applicable data protection laws, you have the right to request access to your personal data, request correction of inaccurate records, request deletion of your information, or withdraw marketing consent at any time.",
          "To exercise any of these rights, contact carl@independentadvisors.ai. We process verifiable requests within 30 days.",
        ],
      },
      {
        heading: "Security measures and minors",
        body: [
          "We employ robust technical and administrative security controls, including TLS encryption, multi-factor authentication, and restricted administrative permissions.",
          "Cash Flow Mastery is intended exclusively for business owners and working professionals aged 18 and older, and does not knowingly collect data from minors.",
        ],
      },
      {
        heading: "Updates and regulatory complaints",
        body: [
          "We may periodically revise this policy. Material updates will be highlighted on our website.",
          "If you have unresolved concerns, you may contact carl@independentadvisors.ai or lodge a formal enquiry with the competent UAE Data Office.",
        ],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Notice",
    shortTitle: "Cookies",
    description:
      "Information on the cookies and browser storage technologies used on the Cash Flow Mastery website.",
    status: "approved",
    version: "1.0",
    lastUpdated: "2 October 2026",
    effectiveDate: "2 October 2026",
    sections: [
      {
        heading: "What are cookies",
        body: [
          "Cookies are small text files stored on your computer or mobile device when you access a website. They allow the website to operate securely, remember your user settings, and understand site usage.",
        ],
      },
      {
        heading: "Cookie categories used on this site",
        body: [
          "• Strictly Necessary Cookies: Essential for core navigation, application security, CSRF protection, and Stripe checkout iframe operation. These cookies cannot be disabled without breaking checkout functionality.",
          "• Functional Storage: Used to remember user preferences (such as interactive diagnostic state or theme choices).",
          "• Analytics Cookies: Used to gather aggregated, anonymised metrics on website traffic and page performance to help us improve user experience.",
          "• Marketing Cookies: We do not use third-party behavioral advertising or tracking cookies without explicit opt-in consent.",
        ],
      },
      {
        heading: "Production cookie & storage inventory",
        body: [
          "• __stripe_mid / __stripe_sid (Provider: Stripe): Strictly necessary for secure payment processing and fraud risk assessment. Duration: Session / 1 year.",
          "• session_csrf_token (Provider: Cash Flow Mastery): Strictly necessary to protect forms against cross-site request forgery. Duration: Session.",
          "• cookie_consent_state (Provider: Cash Flow Mastery): Strictly necessary to store your privacy and cookie preferences. Duration: 12 months.",
          "• aggregated_analytics (Provider: Privacy-first analytics): Measures aggregate visitor counts without cross-site profiling.",
        ],
      },
      {
        heading: "Managing your cookie choices",
        body: [
          "You can adjust your browser settings at any time to block or delete cookies. However, disabling strictly necessary cookies will prevent the Stripe embedded checkout from loading properly.",
        ],
      },
      {
        heading: "Contact and queries",
        body: [
          "For any questions regarding our cookie practices, email carl@independentadvisors.ai.",
        ],
      },
    ],
  },
  {
    slug: "disclaimer",
    title: "Training Disclaimer",
    shortTitle: "Disclaimer",
    description:
      "Clarifying the boundary between cash-flow management education and regulated financial or CFO advice.",
    status: "approved",
    version: "1.0",
    lastUpdated: "2 October 2026",
    effectiveDate: "2 October 2026",
    sections: [
      {
        heading: "Education, not individual regulated advice",
        body: [
          "Cash Flow Mastery is an executive training programme designed to teach SME owners and managers practical cash-flow forecasting principles.",
          "The website, diagnostic assessments, curriculum, live group clinics, workbooks, spreadsheet models, and templates are provided strictly for general commercial education.",
          "They do not constitute bespoke accounting, statutory auditing, tax advice, legal advice, investment advice, lending advisory, or insolvency consulting for any specific entity.",
          "Enrolment in Cash Flow Mastery does not create an auditor-client, attorney-client, fiduciary, or fractional-CFO engagement.",
        ],
      },
      {
        heading: "Your business information and commercial decisions",
        body: [
          "Forecast models and financial projections are only as reliable as the underlying historical figures, operational assumptions, and inputs provided by you.",
          "Course demonstrations may use simplified scenarios regarding VAT, corporate tax, payroll, and debt structures for educational clarity. You remain solely responsible for validating your company's inputs, updating forecasting models, and making all commercial decisions.",
        ],
      },
      {
        heading: "No financial outcome guarantees",
        body: [
          "We do not guarantee improved cash balances, business profits, debt recovery, successful bank financing, or avoidance of commercial insolvency.",
          "Past examples, case studies, or illustrative models do not predict future financial outcomes. A 13-week cash-flow forecast is an internal decision-support tool, not an assurance that future cash receipts or disbursements will occur as modelled.",
        ],
      },
      {
        heading: "Consult qualified professionals when required",
        body: [
          "You should consult a licensed chartered accountant, tax practitioner, corporate lawyer, auditor, or insolvency adviser whenever your specific corporate circumstances require professional counsel.",
          "Seek immediate regulated advice if your business is unable to meet liabilities as they fall due or faces critical statutory or banking deadlines.",
        ],
      },
      {
        heading: "Relationship with Independent Advisors",
        body: [
          "Independent Advisors provides separate, bespoke fractional-CFO and strategic advisory services under separately negotiated client agreements and fee structures.",
          "Purchasing Cash Flow Mastery does not include bespoke corporate implementation or fractional-CFO representation. Any subsequent advisory work requires a distinct written contract.",
          "Carl Lewis and Independent Advisors do not receive undisclosed third-party commissions from software vendors or tools mentioned during training.",
        ],
      },
      {
        heading: "Third-party tools and external links",
        body: [
          "The programme may reference external accounting software, spreadsheet tools, or banking services. Such references do not constitute formal endorsements or warranties. You should independently evaluate external provider terms, pricing, and cybersecurity standards before use.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "Questions regarding the educational scope of Cash Flow Mastery should be directed to carl@independentadvisors.ai prior to enrolment.",
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
