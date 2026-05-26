type LiveChatEmailParams = {
  senderName: string;
  senderEmail: string;
  message: string;
  visitorId?: string;
};

type ContactFormEmailParams = {
  senderName: string;
  senderEmail: string;
  phone?: string;
  subject?: string;
  message: string;
};

type VisitorReplyEmailParams = {
  recipientEmail: string;
  recipientName?: string;
  replyMessage: string;
  subject?: string;
};

const ADMIN_EMAIL = process.env.NODEMAILER_TO || "hasnat.dev.26@gmail.com";

function hasMailConfig() {
  return Boolean(
    (process.env.NODEMAILER_USER || process.env.SMTP_USER) &&
      (process.env.NODEMAILER_PASS || process.env.SMTP_PASS)
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendLiveChatNotificationEmail(params: LiveChatEmailParams) {
  if (!hasMailConfig()) return false;

  const { default: nodemailer } = await import("nodemailer");

  const host = process.env.NODEMAILER_HOST || process.env.SMTP_HOST;
  const port = Number(process.env.NODEMAILER_PORT || process.env.SMTP_PORT || 587);
  const user = process.env.NODEMAILER_USER || process.env.SMTP_USER;
  const pass = process.env.NODEMAILER_PASS || process.env.SMTP_PASS;
  const from = process.env.NODEMAILER_FROM || process.env.SMTP_FROM || user;
  const secure = port === 465;

  const transporter = host
    ? nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass,
        },
      });

  const subject = `New visitor message - ${params.senderName}`;
  const safeMessage = escapeHtml(params.message || "");
  const text = [
    "A new visitor message arrived from website live chat.",
    "",
    "Message:",
    params.message,
  ].join("\n");
  const html = `
    <div style="margin:0;padding:0;background:#eef2ff;font-family:Arial,sans-serif;color:#0f172a;">
      <style>
        @media only screen and (max-width: 640px) {
          .mail-shell { padding: 12px !important; }
          .mail-card { border-radius: 12px !important; }
          .mail-header { padding: 14px !important; }
          .mail-header h2 { font-size: 19px !important; }
          .mail-body { padding: 14px !important; }
          .mail-table td { display:block !important; width:100% !important; padding:6px 0 !important; }
          .mail-message { padding: 12px !important; }
        }
        @media only screen and (max-width: 420px) {
          .mail-shell { padding: 8px !important; }
          .mail-header h2 { font-size: 17px !important; }
          .mail-body p, .mail-body td { font-size: 14px !important; }
        }
      </style>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="mail-shell" style="padding:24px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="mail-card" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:14px;overflow:hidden;">
              <tr>
                <td class="mail-header" style="padding:18px 22px;background:linear-gradient(90deg,#0ea5e9,#2563eb,#4f46e5);color:#ffffff;">
                  <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.9;">Live Chat Alert</p>
                  <h2 style="margin:6px 0 0;font-size:22px;line-height:1.3;">New Visitor Message</h2>
                </td>
              </tr>
              <tr>
                <td class="mail-body" style="padding:20px 22px;">
                  <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">
                    A new visitor message arrived from website live chat.
                  </p>
                  <div class="mail-message" style="margin-top:16px;padding:14px;border:1px solid #dbeafe;border-radius:10px;background:#f8fafc;">
                    <p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">Message</p>
                    <p style="margin:0;font-size:15px;line-height:1.7;color:#0f172a;white-space:pre-wrap;word-break:break-word;">${safeMessage}</p>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: ADMIN_EMAIL,
    subject,
    text,
    html,
    replyTo: params.senderEmail,
  });

  return true;
}

export async function sendVisitorReplyEmail(params: VisitorReplyEmailParams) {
  if (!hasMailConfig()) return false;

  const { default: nodemailer } = await import("nodemailer");

  const host = process.env.NODEMAILER_HOST || process.env.SMTP_HOST;
  const port = Number(process.env.NODEMAILER_PORT || process.env.SMTP_PORT || 587);
  const user = process.env.NODEMAILER_USER || process.env.SMTP_USER;
  const pass = process.env.NODEMAILER_PASS || process.env.SMTP_PASS;
  const from = process.env.NODEMAILER_FROM || process.env.SMTP_FROM || user;
  const secure = port === 465;

  const transporter = host
    ? nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass,
        },
      });

  const mailSubject = params.subject?.trim()
    ? `Reply: ${params.subject.trim()}`
    : "Reply from Hasnat Evan";
  const text = [
    `Hello ${params.recipientName || "there"},`,
    "",
    "Thank you for your message. Here is our reply:",
    "",
    params.replyMessage,
    "",
    "Best regards,",
    "Hasnat Evan",
  ].join("\n");

  await transporter.sendMail({
    from,
    to: params.recipientEmail,
    subject: mailSubject,
    text,
  });

  return true;
}

export async function sendContactFormEmail(params: ContactFormEmailParams) {
  if (!hasMailConfig()) return false;

  const { default: nodemailer } = await import("nodemailer");

  const host = process.env.NODEMAILER_HOST || process.env.SMTP_HOST;
  const port = Number(process.env.NODEMAILER_PORT || process.env.SMTP_PORT || 587);
  const user = process.env.NODEMAILER_USER || process.env.SMTP_USER;
  const pass = process.env.NODEMAILER_PASS || process.env.SMTP_PASS;
  const from = process.env.NODEMAILER_FROM || process.env.SMTP_FROM || user;
  const secure = port === 465;

  const transporter = host
    ? nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      })
    : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user,
          pass,
        },
      });

  const mailSubject = params.subject?.trim()
    ? `New contact form message - ${params.subject.trim()}`
    : `New contact form message - ${params.senderName}`;
  const text = [
    "A new message arrived from the Contact Form.",
    "",
    `Name: ${params.senderName}`,
    `Email: ${params.senderEmail}`,
    `Phone: ${params.phone?.trim() || "N/A"}`,
    `Subject: ${params.subject?.trim() || "N/A"}`,
    "",
    "Message:",
    params.message,
  ].join("\n");
  const safeName = escapeHtml(params.senderName || "Visitor");
  const safeEmail = escapeHtml(params.senderEmail || "N/A");
  const safePhone = escapeHtml(params.phone?.trim() || "N/A");
  const safeSubject = escapeHtml(params.subject?.trim() || "N/A");
  const safeMessage = escapeHtml(params.message || "");
  const html = `
    <div style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a;">
      <style>
        @media only screen and (max-width: 640px) {
          .mail-shell { padding: 12px !important; }
          .mail-card { border-radius: 12px !important; }
          .mail-header { padding: 14px !important; }
          .mail-header h2 { font-size: 19px !important; }
          .mail-body { padding: 14px !important; }
          .mail-table td { display: block !important; width: 100% !important; padding: 6px 0 !important; }
          .mail-message { padding: 12px !important; }
        }
        @media only screen and (max-width: 420px) {
          .mail-shell { padding: 8px !important; }
          .mail-header h2 { font-size: 17px !important; }
          .mail-body p, .mail-body td { font-size: 14px !important; }
        }
      </style>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="mail-shell" style="padding:24px;">
        <tr>
          <td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="mail-card" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
        <tr>
          <td class="mail-header" style="padding:18px 22px;background:linear-gradient(90deg,#a21caf,#7c3aed,#2563eb);color:#ffffff;">
            <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.9;">Portfolio Contact</p>
            <h2 style="margin:6px 0 0;font-size:22px;line-height:1.3;">New Contact Form Message</h2>
          </td>
        </tr>
        <tr>
          <td class="mail-body" style="padding:20px 22px;">
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#334155;">
              A new visitor submitted the contact form.
            </p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="mail-table" style="border-collapse:collapse;">
              <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">Name</td><td style="padding:8px 0;font-size:15px;font-weight:600;color:#0f172a;word-break:break-word;">${safeName}</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">Email</td><td style="padding:8px 0;font-size:15px;font-weight:600;color:#0f172a;word-break:break-word;">${safeEmail}</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">Phone</td><td style="padding:8px 0;font-size:15px;font-weight:600;color:#0f172a;word-break:break-word;">${safePhone}</td></tr>
              <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">Subject</td><td style="padding:8px 0;font-size:15px;font-weight:600;color:#0f172a;word-break:break-word;">${safeSubject}</td></tr>
            </table>
            <div class="mail-message" style="margin-top:16px;padding:14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;">Message</p>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#0f172a;white-space:pre-wrap;word-break:break-word;">${safeMessage}</p>
            </div>
          </td>
        </tr>
      </table>
          </td>
        </tr>
      </table>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: ADMIN_EMAIL,
    subject: mailSubject,
    text,
    html,
    replyTo: params.senderEmail,
  });

  return true;
}
