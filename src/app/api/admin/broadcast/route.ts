import { NextResponse } from "next/server";
import { listLeads, type LeadSource } from "@/lib/leads";
import { listEnrolments } from "@/lib/enrolments";
import { sendEmailBroadcast } from "@/lib/email";
import { isSameOrigin, rateLimit, clientIp } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Admin Email Broadcast Route.
 *
 * Dispatches an email campaign or announcement to specific target audiences.
 * Protected by an ADMIN_SECRET_KEY / authorization header.
 */
export async function POST(request: Request) {
  // Authorization guard
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const limited = rateLimit(`broadcast:${clientIp(request)}`, 5, 10 * 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before broadcasting again." },
      { status: 429 },
    );
  }

  let body: {
    target?: "all" | "enrolled" | "waitlist" | "diagnostic";
    subject?: string;
    htmlContent?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { target = "all", subject, htmlContent } = body;

  if (!subject || !htmlContent) {
    return NextResponse.json(
      { error: "subject and htmlContent are required." },
      { status: 400 },
    );
  }

  const recipientEmails = new Set<string>();

  try {
    if (target === "all" || target === "enrolled") {
      const enrolments = await listEnrolments();
      for (const e of enrolments) {
        if (!e.revokedAt && e.email) {
          recipientEmails.add(e.email.trim().toLowerCase());
        }
      }
    }

    if (target === "all" || target === "waitlist" || target === "diagnostic") {
      const leadSource = target === "all" ? undefined : (target as LeadSource);
      const leads = await listLeads(leadSource);
      for (const l of leads) {
        if (l.marketingConsent && l.email) {
          recipientEmails.add(l.email.trim().toLowerCase());
        }
      }
    }

    const recipients = Array.from(recipientEmails);

    if (recipients.length === 0) {
      return NextResponse.json({
        message: "No eligible recipients found with marketing consent.",
        recipientsCount: 0,
      });
    }

    const result = await sendEmailBroadcast({
      recipients,
      subject,
      htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: `Broadcast processed for ${result.total} recipients.`,
      stats: result,
    });
  } catch (err) {
    console.error("[admin/broadcast] Error sending broadcast:", err);
    return NextResponse.json(
      { error: "Broadcast failed to process.", details: String(err) },
      { status: 500 },
    );
  }
}
