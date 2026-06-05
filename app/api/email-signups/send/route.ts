import { NextResponse } from "next/server";
import { requireDashboardSession } from "@/lib/dashboard-auth";
import { sendSubscriberEmail } from "@/lib/email";
import { getDb } from "@/lib/mongodb";

type SendEmailBody = {
  recipientEmail?: string;
  sendToAll?: boolean;
  subject?: string;
  message?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  const authError = await requireDashboardSession();
  if (authError) return authError;

  try {
    const body = (await req.json()) as SendEmailBody;
    const recipientEmail = body.recipientEmail?.trim().toLowerCase();
    const sendToAll = Boolean(body.sendToAll);
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!sendToAll && (!recipientEmail || !isValidEmail(recipientEmail))) {
      return NextResponse.json({ ok: false, message: "Valid recipient email is required." }, { status: 400 });
    }

    if (!subject) {
      return NextResponse.json({ ok: false, message: "Subject is required." }, { status: 400 });
    }

    if (!message) {
      return NextResponse.json({ ok: false, message: "Message is required." }, { status: 400 });
    }

    if (sendToAll) {
      const db = await getDb();
      const signups = await db
        .collection("email_signups")
        .find({}, { projection: { email: 1 } })
        .toArray();
      const recipientEmails = Array.from(
        new Set(
          signups
            .map((signup) => String(signup.email || "").trim().toLowerCase())
            .filter((email) => isValidEmail(email))
        )
      );

      if (!recipientEmails.length) {
        return NextResponse.json({ ok: false, message: "No email signups found." }, { status: 404 });
      }

      let sentCount = 0;
      for (const email of recipientEmails) {
        const sent = await sendSubscriberEmail({
          recipientEmail: email,
          subject,
          message,
        });

        if (!sent) {
          return NextResponse.json({ ok: false, message: "Email config is missing." }, { status: 500 });
        }

        sentCount += 1;
      }

      return NextResponse.json(
        { ok: true, message: `Email sent to ${sentCount} signup${sentCount === 1 ? "" : "s"}.`, sentCount },
        { status: 200 }
      );
    }

    const sent = await sendSubscriberEmail({
      recipientEmail: recipientEmail!,
      subject,
      message,
    });

    if (!sent) {
      return NextResponse.json({ ok: false, message: "Email config is missing." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Email sent successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: "Failed to send email.", error: String(error) },
      { status: 500 }
    );
  }
}
