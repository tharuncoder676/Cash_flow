Subject: Website review — what is fixed, and what we need from you to go live

Dear Carl,

Thank you for going through the site so carefully. Every point you raised was valid, and five of them are already fixed. Below is what changed, the answer to your legal question, and the decisions we now need from you.

---

## 1. What you found, and what we did

**Time commitment — corrected.**
You were right that the figures did not add up. The site now states the total in one place and everything else reads from it: *"About 2½ hours — roughly 90 minutes of lessons plus one 60–75 minute live session."* There is no longer anywhere that says 90 minutes on its own.

**Diagnostic scoring — one genuine error, now fixed.**
You were right about question 3. It read *"Growth in sales makes me more comfortable about cash, not less"* and awarded full marks for agreeing — when believing that is precisely the misconception Week 1 exists to correct. It now reads: *"I understand why a fast-growing month can leave less cash in the bank, not more."*

On the 4/20 you scored by answering "No" to everything — that figure is actually correct. Two statements are deliberately negative: *"We have delayed a supplier payment to manage cash"* and *"A tax, VAT or annual payment has caught us out."* Answering "No" to those is good news, so each earns 2 marks. Four out of twenty is the diagnostic working, not failing.

On your wider point about systematic testing: we audited all ten statements, and question 3 was the only one scored the wrong way. We have also changed how the questions are defined so the direction must be stated explicitly for every one — the site will now refuse to build if anyone adds a question without declaring which answer is the good one. We then tested every combination:

| Answers given | Score |
|---|---|
| "No" to everything | 4 / 20 |
| "Partly" to everything | 10 / 20 |
| "Yes" to everything | 16 / 20 |
| The ideal answer to each | 20 / 20 |
| The worst answer to each | 0 / 20 |

**Enrolment journey — fixed at the cause.**
This was not a wording problem. The buttons were fixed text, while the enrolment page separately checked whether card payment was switched on. Because payment is not yet live, the page offered the waitlist while the buttons still said "Secure your place."

Both now read from the same fact. While payment is off, every primary button reads **"Join the founding-cohort waitlist"** and the enrolment page is headed "Enrolment opens shortly" — exactly as you asked. The day payment goes live they all change back on their own, with nothing for us to edit and nothing to forget.

**The workbook — wording changed.**
"The same Excel model Carl uses" now reads *"The Excel model Carl builds with fractional CFO clients"*, and the templates section says they are *built from* the models you use. That reflects what you told us: different models for different industries.

**Confidentiality — reworded, with one caveat.**
The flat "Yes" is gone. It now says you choose what you share, that every participant accepts a confidentiality obligation in the course terms, and points to the privacy policy for how information is held.

The caveat, and we would rather be straight about it: that answer now refers to an obligation in the course terms, and the course terms are not yet written. **It should not go live in front of customers until they are.** We have also deliberately said nothing about recordings, because you flagged the recording policy as still to be agreed.

---

## 2. Your question about the legal work

> *"Are you waiting on me for this?"*

Yes. The terms, refund policy, privacy policy, cookie notice and disclaimer are built as structured documents with every required section in place, but the wording itself has to come from you and your adviser. They currently carry a visible "not in force" notice and are hidden from search engines, so nothing unreviewed can quietly go live.

What your adviser needs to supply:

1. Selling entity, and governing law and jurisdiction
2. VAT treatment — is the entity VAT-registered, is the price inclusive or exclusive, and does it differ for buyers outside the UAE
3. Refund and cancellation terms (the site currently shows a placeholder: "full refund if you withdraw more than 7 days before the start date")
4. The group confidentiality obligation
5. The recording policy — are sessions recorded, who can see them, and for how long
6. Whether there is a minimum cohort size below which the course will not run
7. How long access lasts after the cohort ends

---

## 3. The new pricing — yes, it can be built

Two observations first.

**Your USD founding prices are almost exactly the current AED prices.** AED 2,000 is USD 545 and you proposed 550; AED 2,500 is USD 681 and you proposed 695. So the founding tiers are the same money in a different currency, not a price increase. That is a straightforward change.

**The premium tier is described three different ways** in your message: first as "5 private CFO sessions", then as a 60-minute diagnostic plus a forecast review plus a 45-minute implementation session plus priority email, and then as "plus 5 private group sessions". We cannot build or sell it until it is one thing.

Decisions we need:

1. **Currency.** Move everything to USD, or keep AED and display USD alongside? This affects VAT and invoicing, so your accountant should see the question.
2. **Premium price.** 1,495 or 1,995? A range cannot be charged.
3. **Premium contents.** Which of the three descriptions above is the correct one?
4. **Basic plan at USD 450.** Confirmed it opens only after the first cohort finishes, when the cohort price is 995? At 695 it would undercut the live programme by too little.
5. **Cohort size.** Still 15 places, with the first five at the founding price?

One sequencing note: the tiered structure has to come after the database work in section 5, because each sale needs to record which product was bought.

---

## 4. Emails to customers — what we need from you

The site already captures diagnostic results, waitlist sign-ups and enrolments, and stores the consent wording and timestamp with each one, so the list is clean from day one. What it does not yet do is send anything. There are two separate jobs here, and they need different tools.

**Automatic emails** — the receipt, the welcome and joining instructions, session reminders, refund confirmations.

**Broadcasts you send yourself** — cohort announcements, the nurture sequence to the waitlist, anything to the diagnostic list.

To set both up, we need the following from you:

1. **The sending address.** For example `hello@cashflowmastery.co`, or your existing `carl@independentadvisors.ai`. Also the name it should appear from, and where replies should go.
2. **Access to the domain's DNS settings** — or the name of whoever manages them. We need to add three records (SPF, DKIM and DMARC). Without them your emails land in spam, and this is the most common reason course emails are never seen. It is the one item here we cannot work around.
3. **Confirmation of who owns `cashflowmastery.co`**, with the registrar login or an introduction to whoever holds it.
4. **Which provider, and whose account pays.** Our recommendation:
   - Automatic emails: **Resend** — free up to 3,000 emails a month
   - Broadcasts: **MailerLite** — free up to 1,000 subscribers

   Both can sit on your own account, so the list is always yours. If you would rather have one tool for both, MailerLite can do it, though slightly less reliably for receipts.
5. **A postal address for the footer of marketing emails.** Legally expected in most markets and required by both providers.
6. **Who writes the emails.** We will build and connect them; we need the wording for the welcome, the joining instructions and the reminders — or your approval for us to draft them in your voice for your review.

---

## 5. Everything still needed to make the site fully live

Grouped by who each item is waiting on.

### Waiting on you — blocking launch

| Item | Why it blocks |
|---|---|
| Cohort start date, and the four session dates and times | Must be shown at checkout before anyone pays |
| VAT treatment | Must be stated at checkout |
| Refund policy, legally reviewed | Appears at checkout and in three other places |
| The five legal documents | The course cannot be sold without them |
| The domain, and access to its DNS | Needed for both the web address and email |
| The pricing decisions in section 3 | Determines what we build next |

### Waiting on you — needed before the cohort runs, not before launch

- The real logo as an SVG or a large PNG, in light and dark versions. A placeholder mark is in use; we did not want to invent a brand you had not approved.
- The welcome and closing videos, and a decision on video hosting. We recommend Vimeo Pro, around USD 20 a month, with private links.
- The final Excel workbook, Cash-Cycle Map, diagnostic worksheet, assumptions checklist, weekly meeting agenda and 30-day plan.
- Confirmation of the support inbox — currently `carl@independentadvisors.ai`.
- A decision on Stripe's currency conversion. Stripe is currently offering overseas buyers their own currency with a **4% fee added**. It is a switch in your Stripe settings, and it interacts with the USD question above.

### Our work, once the above is unblocked

- Move enrolments and leads to a proper database. The current storage does not survive on the live hosting, so this is the first thing we do, and nothing can be tested online until it is done.
- Connect the email provider and build the automatic emails.
- Install analytics and the cookie consent banner — both depend on the approved cookie notice.
- Switch Stripe from test keys to live keys and point the live payment notifications at the real domain.
- A social sharing image, so links shared on WhatsApp and LinkedIn preview properly.
- A final accessibility, performance and cross-device pass before launch.

---

## What would help most this week

If we had three things, we could move a long way:

1. **DNS access**, or the contact for it, so email can be set up in parallel
2. The **pricing decisions** in section 3
3. The **legal documents** started with your adviser, as they take the longest

The payment system itself is built and tested. We ran a full test transaction this week and confirmed that a place is granted only by a verified payment; that a failed or unpaid attempt grants nothing; that a duplicate notification cannot double-book a place; and that a partial refund keeps the place while a full refund releases it back into availability.

Happy to walk through any of this on a call.

Kind regards,

Tharun
Flarenet Company
