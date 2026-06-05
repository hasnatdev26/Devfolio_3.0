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

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
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
        try {
          const sent = await sendSubscriberEmail({
            recipientEmail: email,
            subject,
            message,
          });

          if (!sent) {
            return NextResponse.json(
              { ok: false, message: "Email config is missing. Check NODEMAILER_USER and NODEMAILER_PASS." },
              { status: 500 }
            );
          }

          sentCount += 1;
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          console.error("Failed to send subscriber email to", email, errorMessage);
          return NextResponse.json(
            {
              ok: false,
              message: `Failed to send email to ${email}. ${errorMessage}`,
              error: errorMessage,
            },
            { status: 500 }
          );
        }
      }

      return NextResponse.json(
        { ok: true, message: `Email sent to ${sentCount} signup${sentCount === 1 ? "" : "s"}.`, sentCount },
        { status: 200 }
      );
    }

    try {
      const sent = await sendSubscriberEmail({
        recipientEmail: recipientEmail!,
        subject,
        message,
      });

      if (!sent) {
        return NextResponse.json(
          { ok: false, message: "Email config is missing. Check NODEMAILER_USER and NODEMAILER_PASS." },
          { status: 500 }
        );
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Failed to send subscriber email to", recipientEmail, errorMessage);
      return NextResponse.json(
        {
          ok: false,
          message: `Failed to send email to ${recipientEmail}. ${errorMessage}`,
          error: errorMessage,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, message: "Email sent successfully." }, { status: 200 });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error("Failed to process email signup send request", errorMessage);
    return NextResponse.json(
      { ok: false, message: "Failed to send email.", error: errorMessage },
      { status: 500 }
    );
  }
}
