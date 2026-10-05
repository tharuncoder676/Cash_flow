import "server-only";
import { site, pricing, contact, whatsappUrl } from "@/content/course";

/**
 * Resend Email Infrastructure.
 *
 * Uses native fetch to interact with Resend REST API (https://api.resend.com).
 * Zero extra bundle dependencies, instant execution, and maximum serverless reliability.
 */

const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_AUDIENCES_URL = "https://api.resend.com/audiences";

function getApiKey(): string | null {
  return process.env.RESEND_API_KEY ?? null;
}

function getFromAddress(): string {
  return (
    process.env.EMAIL_FROM ||
    `Carl Reader <carl@cashflowmastery.co>`
  );
}

export type EnrolmentEmailProps = {
  to: string;
  name?: string | null;
  enrolmentId: string;
  tier: string;
  amountMinor: number;
  currency: string;
};

/**
 * Sends a high-contrast luxury onboarding email to a newly enrolled founding student.
 */
export async function sendEnrolmentConfirmationEmail(
  props: EnrolmentEmailProps,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY is not configured — skipping automated welcome email.",
    );
    return { success: false, error: "RESEND_API_KEY not set" };
  }

  const amountFormatted = (props.amountMinor / 100).toLocaleString("en-US", {
    style: "currency",
    currency: props.currency || "USD",
  });

  const studentName = props.name?.trim() || "Founding Member";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Welcome to Cash Flow Mastery</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050e24; color: #fbf8f1; margin: 0; padding: 30px 15px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #0a1631; border: 1px solid rgba(212,162,76,0.3); border-radius: 4px; overflow: hidden; }
    .header { background-color: #050e24; padding: 24px 30px; border-bottom: 1px solid rgba(212,162,76,0.25); text-align: left; }
    .brand { color: #fbf8f1; font-size: 20px; font-weight: bold; }
    .brand-gold { color: #d4a24c; font-style: italic; }
    .content { padding: 32px 30px; line-height: 1.65; color: #ebe2ce; }
    .h1 { color: #fbf8f1; font-size: 24px; margin-top: 0; margin-bottom: 16px; }
    .badge { display: inline-block; background: rgba(212,162,76,0.15); color: #e8bc6c; border: 1px solid rgba(212,162,76,0.3); padding: 4px 10px; font-size: 11px; font-family: monospace; text-transform: uppercase; border-radius: 2px; margin-bottom: 20px; }
    .receipt-box { background: #050e24; border: 1px solid rgba(251,248,241,0.1); padding: 20px; border-radius: 2px; margin: 24px 0; font-family: monospace; font-size: 13px; }
    .receipt-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: #ddd0b4; }
    .receipt-total { border-top: 1px dashed rgba(212,162,76,0.4); padding-top: 10px; margin-top: 10px; font-weight: bold; color: #fbf8f1; }
    .btn { display: inline-block; background: #d4a24c; color: #050e24; font-weight: bold; text-decoration: none; padding: 14px 28px; border-radius: 2px; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; margin: 20px 0; }
    .footer { padding: 24px 30px; background: #050e24; border-top: 1px solid rgba(251,248,241,0.08); font-size: 12px; color: #5b6788; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="brand">Cash Flow <span class="brand-gold">Mastery</span></span>
    </div>
    <div class="content">
      <span class="badge">Founding Cohort Confirmed</span>
      <h1 class="h1">Welcome, ${studentName}.</h1>
      <p>Your place in the founding cohort of <strong>Cash Flow Mastery</strong> is officially secured and recorded on our ledger.</p>
      
      <div class="receipt-box">
        <div class="receipt-row"><span>MEMBER REF:</span><span>${props.enrolmentId}</span></div>
        <div class="receipt-row"><span>COHORT TIER:</span><span>${props.tier.toUpperCase()}</span></div>
        <div class="receipt-row"><span>PAYMENT STATUS:</span><span>PAID IN FULL</span></div>
        <div class="receipt-row receipt-total"><span>TOTAL INVESTMENT:</span><span>${amountFormatted}</span></div>
      </div>

      <h3 style="color: #fbf8f1; margin-top: 24px; font-size: 16px;">Next Steps & Preparation:</h3>
      <ol style="padding-left: 20px; color: #ddd0b4;">
        <li style="margin-bottom: 10px;"><strong>Calendar Invitations:</strong> You will receive Google Calendar & Zoom invites with direct links for all 4 live weekly sessions prior to our kickoff date.</li>
        <li style="margin-bottom: 10px;"><strong>Course Workbook:</strong> Download your 13-week cash forecasting framework and pre-work syllabus below.</li>
        <li style="margin-bottom: 10px;"><strong>Direct Access:</strong> Save Carl's direct WhatsApp line for any private questions before Week 1.</li>
      </ol>

      <center>
        <a href="https://cash-flow-mastery.vercel.app/cash-flow-mastery-curriculum.pdf" class="btn">Download 13-Week Syllabus & Workbook</a>
      </center>

      <p style="margin-top: 30px; font-size: 14px; color: #ddd0b4;">
        I look forward to working through your numbers together and giving you complete forward visibility over your cash.
      </p>
      <p style="font-size: 14px; color: #fbf8f1; margin-bottom: 0;">
        <strong>Carl Reader</strong><br />
        <span style="color: #d4a24c; font-size: 12px;">Independent Advisors · Dubai, UAE</span>
      </p>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Cash Flow Mastery by Independent Advisors. All rights reserved.<br />
      Need assistance? Contact <a href="mailto:carl@cashflowmastery.co" style="color: #d4a24c;">carl@cashflowmastery.co</a> or WhatsApp +971 50 123 4567.
    </div>
  </div>
</body>
</html>
  `;

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [props.to],
        subject: `Welcome to Cash Flow Mastery — Your Founding Cohort Confirmation (${props.enrolmentId})`,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("[email] Resend API error:", res.status, errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    console.info(`[email] Welcome email delivered to ${props.to} (ID: ${data.id})`);
    return { success: true, id: data.id };
  } catch (err) {
    console.error("[email] Failed to send welcome email:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Broadcast an email to a list of recipients (e.g. Waitlist, Diagnostic Leads, or Enrolled).
 */
export async function sendEmailBroadcast(props: {
  recipients: string[];
  subject: string;
  htmlContent: string;
}): Promise<{ total: number; sent: number; errors: number }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  let sent = 0;
  let errors = 0;

  // Send batch via Resend
  for (const recipient of props.recipients) {
    try {
      const res = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: getFromAddress(),
          to: [recipient],
          subject: props.subject,
          html: props.htmlContent,
        }),
      });

      if (res.ok) sent++;
      else errors++;
    } catch {
      errors++;
    }
  }

  return { total: props.recipients.length, sent, errors };
}
