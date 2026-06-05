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

type SubscriberEmailParams = {
  recipientEmail: string;
  subject: string;
  message: string;
};

const ADMIN_EMAIL = process.env.NODEMAILER_TO || "hasnat.dev.26@gmail.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://hasnatevan.top";
const SITE_NAME = "Hasnat Evan";
const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");
const SITE_TAGLINE = "Full Stack Web Developer";
const BRAND_GRADIENT = "linear-gradient(90deg,#d946ef,#9333ea,#6d28d9)";

function hasMailConfig() {
  return Boolean(
    (process.env.NODEMAILER_USER || process.env.SMTP_USER) &&
      (process.env.NODEMAILER_PASS || process.env.SMTP_PASS)
  );
}

function isTruthyEnvValue(value: string | undefined) {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return !["0", "false", "no", "off"].includes(normalized);
}

async function createMailTransporter() {
  const { default: nodemailer } = await import("nodemailer");

  const host = process.env.NODEMAILER_HOST || process.env.SMTP_HOST;
  const user = process.env.NODEMAILER_USER || process.env.SMTP_USER;
  const pass = process.env.NODEMAILER_PASS || process.env.SMTP_PASS;
  const resolvedHost = host || (user?.toLowerCase().endsWith("@gmail.com") ? "smtp.gmail.com" : "");
  const port = Number(
    process.env.NODEMAILER_PORT ||
      process.env.SMTP_PORT ||
      (resolvedHost === "smtp.gmail.com" ? 465 : 587)
  );
  const secure =
    isTruthyEnvValue(process.env.NODEMAILER_SECURE) ||
    isTruthyEnvValue(process.env.SMTP_SECURE) ||
    port === 465;
  const from = process.env.NODEMAILER_FROM || process.env.SMTP_FROM || user;

  if (resolvedHost) {
    return {
      from,
      transporter: nodemailer.createTransport({
        host: resolvedHost,
        port,
        secure,
        auth: {
          user,
          pass,
        },
      }),
    };
  }

  return {
    from,
    transporter: nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    }),
  };
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
  const { from, transporter } = await createMailTransporter();

  const subject = `New visitor message - ${params.senderName}`;
  const safeName = escapeHtml(params.senderName || "Website Visitor");
  const safeMessage = escapeHtml(params.message || "");
  const text = [
    "A new visitor message arrived from website live chat.",
    "",
    `Visitor Name: ${params.senderName || "Website Visitor"}`,
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
                  <div style="margin-top:16px;padding:14px;border:1px solid #bfdbfe;border-radius:10px;background:#eff6ff;">
                    <p style="margin:0 0 7px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;">Visitor Name</p>
                    <p style="margin:0;font-size:18px;line-height:1.4;font-weight:700;color:#0f172a;word-break:break-word;">${safeName}</p>
                  </div>
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
  const { from, transporter } = await createMailTransporter();

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

export async function sendSubscriberEmail(params: SubscriberEmailParams) {
  if (!hasMailConfig()) return false;
  const { from, transporter } = await createMailTransporter();

  const safeMessage = escapeHtml(params.message || "");
  const safeSiteName = escapeHtml(SITE_NAME);
  const safeSiteTagline = escapeHtml(SITE_TAGLINE);
  const safeSiteDomain = escapeHtml(SITE_DOMAIN);
  const html = `
    <div style="margin:0;padding:0;background:#f5f3ff;font-family:Arial,sans-serif;color:#0f172a;">
      <style>
        @media only screen and (max-width: 640px) {
          .mail-shell { padding: 14px !important; }
          .mail-card { border-radius: 14px !important; }
          .mail-header { padding: 18px !important; }
          .mail-header h2 { font-size: 24px !important; }
          .mail-body { padding: 18px !important; }
          .mail-body p { font-size: 14px !important; }
          .mail-message { padding: 12px !important; }
        }
        @media only screen and (max-width: 420px) {
          .mail-shell { padding: 8px !important; }
          .mail-header h2 { font-size: 21px !important; }
          .mail-body p { font-size: 13px !important; }
          .mail-body .mail-tagline { font-size: 13px !important; }
        }
      </style>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="mail-shell" style="padding:28px 14px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="mail-card" style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e9d5ff;border-radius:18px;overflow:hidden;box-shadow:0 18px 45px rgba(109,40,217,.14);">
              <tr>
                <td class="mail-header" style="padding:0;background:${BRAND_GRADIENT};">
                  <div style="padding:26px 28px;">
                    <p style="margin:0;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#f5d0fe;font-weight:700;">Portfolio Message</p>
                    <h2 style="margin:8px 0 0;font-size:30px;line-height:1.22;font-weight:800;color:#ffffff;word-break:break-word;">${safeSiteName}</h2>
                    <p class="mail-tagline" style="margin:7px 0 0;font-size:14px;line-height:1.55;color:#ede9fe;">${safeSiteTagline}</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="mail-body" style="padding:28px;">
                  <div style="padding:20px;border:1px solid #e9d5ff;border-radius:14px;background:#faf5ff;">
                    <p style="margin:0;font-size:15px;line-height:1.75;color:#0f172a;white-space:pre-wrap;word-break:break-word;">${safeMessage}</p>
                  </div>
                  <div style="margin-top:26px;padding-top:18px;border-top:1px solid #e9d5ff;text-align:center;">
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">Sent from ${safeSiteName}'s portfolio.</p>
                    <p style="margin:5px 0 0;font-size:13px;line-height:1.6;">
                      <a href="${SITE_URL}" style="color:#6d28d9;font-weight:700;text-decoration:none;">${safeSiteDomain}</a>
                    </p>
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
    from: `"${SITE_NAME}" <${from}>`,
    to: params.recipientEmail,
    subject: params.subject,
    text: [
      params.message,
      "",
      `Sent from ${SITE_NAME}'s portfolio.`,
      SITE_URL,
    ].join("\n"),
    html,
  });

  return true;
}

export async function sendContactFormEmail(params: ContactFormEmailParams) {
  if (!hasMailConfig()) return false;
  const { from, transporter } = await createMailTransporter();

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
