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

const ADMIN_EMAIL =
  process.env.NODEMAILER_TO || "hasnat.dev.26@gmail.com";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "https://hasnatevan.top";

const SITE_NAME = "Hasnat Evan";
const SITE_DOMAIN = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");
const SITE_TAGLINE = "Full Stack Web Developer";

const BRAND_GRADIENT =
  "linear-gradient(90deg,#d946ef,#9333ea,#6d28d9)";

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

  const host =
    process.env.NODEMAILER_HOST || process.env.SMTP_HOST;

  const user =
    process.env.NODEMAILER_USER || process.env.SMTP_USER;

  const pass =
    process.env.NODEMAILER_PASS || process.env.SMTP_PASS;

  const resolvedHost =
    host ||
    (user?.toLowerCase().endsWith("@gmail.com")
      ? "smtp.gmail.com"
      : "");

  const port = Number(
    process.env.NODEMAILER_PORT ||
      process.env.SMTP_PORT ||
      (resolvedHost === "smtp.gmail.com" ? 465 : 587)
  );

  const secure =
    isTruthyEnvValue(process.env.NODEMAILER_SECURE) ||
    isTruthyEnvValue(process.env.SMTP_SECURE) ||
    port === 465;

  const from =
    process.env.NODEMAILER_FROM ||
    process.env.SMTP_FROM ||
    user;

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

/**
 * Strips accidental leading/trailing whitespace from each line so a
 * stray space or tab before a word (e.g. "  Hello,") doesn't show up
 * as a misaligned indent once rendered with white-space:pre-wrap.
 */
function normalizeMessage(value: string) {
  return (value || "")
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
}

/* =========================================
   LIVE CHAT NOTIFICATION EMAIL
========================================= */

export async function sendLiveChatNotificationEmail(
  params: LiveChatEmailParams
) {
  if (!hasMailConfig()) return false;

  const { from, transporter } = await createMailTransporter();

  const subject = `New visitor message - ${params.senderName}`;

  const safeName = escapeHtml(
    params.senderName || "Website Visitor"
  );

  const safeMessage = escapeHtml(normalizeMessage(params.message));

  const text = [
    "A new visitor message arrived from website live chat.",
    "",
    `Visitor Name: ${params.senderName || "Website Visitor"}`,
    "",
    "Message:",
    normalizeMessage(params.message),
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#eef2ff;font-family:Arial,sans-serif;color:#0f172a;text-align:left;">
      <style>
        @media only screen and (max-width: 640px) {
          .mail-shell { padding: 12px 0 !important; }
          .mail-card { border-radius: 12px !important; }
          .mail-header { padding: 14px !important; }
          .mail-header h2 { font-size: 15px !important; }
          .mail-body { padding: 14px !important; }
          .mail-message { padding: 12px !important; }
        }

        @media only screen and (max-width: 420px) {
          .mail-shell { padding: 8px 0 !important; }
          .mail-header h2 { font-size: 14px !important; }
          .mail-body p { font-size: 11px !important; }
        }
      </style>

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        class="mail-shell"
        style="width:100%;padding:20px 0;text-align:left;"
      >
        <tr>
          <td align="left" style="text-align:left;">

            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              align="center"
              class="mail-card"
              style="width:100%;max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbeafe;border-radius:14px;overflow:hidden;text-align:left;"
            >
              <tr>
                <td
                  class="mail-header"
                  style="padding:16px 20px;background:linear-gradient(90deg,#0ea5e9,#2563eb,#4f46e5);color:#ffffff;text-align:left;"
                >
                  <p
                    style="margin:0;font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.9;text-align:left;"
                  >
                    Live Chat Alert
                  </p>

                  <h2
                    style="margin:5px 0 0;font-size:16px;line-height:1.3;text-align:left;"
                  >
                    New Visitor Message
                  </h2>
                </td>
              </tr>

              <tr>
                <td
                  class="mail-body"
                  style="padding:18px 20px;text-align:left;"
                >
                  <p
                    style="margin:0 0 12px;font-size:11px;line-height:1.6;color:#334155;text-align:left;"
                  >
                    A new visitor message arrived from website live chat.
                  </p>

                  <div
                    style="margin-top:14px;padding:12px;border:1px solid #bfdbfe;border-radius:10px;background:#eff6ff;text-align:left;"
                  >
                    <p
                      style="margin:0 0 6px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;text-align:left;"
                    >
                      Visitor Name
                    </p>

                    <p
                      style="margin:0;font-size:13px;line-height:1.4;font-weight:700;color:#0f172a;word-break:break-word;text-align:left;"
                    >
                      ${safeName}
                    </p>
                  </div>

                  <div
                    class="mail-message"
                    style="margin-top:14px;padding:12px;border:1px solid #dbeafe;border-radius:10px;background:#f8fafc;text-align:left;"
                  >
                    <p
                      style="margin:0 0 7px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;text-align:left;"
                    >
                      Message
                    </p>

                    <p
                      style="margin:0;font-size:12px;line-height:1.6;color:#0f172a;white-space:pre-wrap;word-break:break-word;text-align:left;"
                    >
                      ${safeMessage}
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
    from,
    to: ADMIN_EMAIL,
    subject,
    text,
    html,
    replyTo: params.senderEmail,
  });

  return true;
}

/* =========================================
   VISITOR REPLY EMAIL
========================================= */

export async function sendVisitorReplyEmail(
  params: VisitorReplyEmailParams
) {
  if (!hasMailConfig()) return false;

  const { from, transporter } = await createMailTransporter();

  const mailSubject = params.subject?.trim()
    ? `Reply: ${params.subject.trim()}`
    : "Reply from Hasnat Evan";

  const safeName = escapeHtml(
    params.recipientName || "there"
  );

  const safeReply = escapeHtml(normalizeMessage(params.replyMessage));

  const currentYear = new Date().getFullYear();

  const html = `
    <div style="margin:0;padding:0;background:#eef1f5;font-family:Arial,sans-serif;color:#0f172a;text-align:left;">
      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="width:100%;padding:20px 0;text-align:left;"
      >
        <tr>
          <td align="left" style="text-align:left;">

            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              align="center"
              style="width:100%;max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;text-align:left;"
            >
              <tr>
                <td
                  style="padding:22px 32px;background:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:left;"
                >
                  <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#d946ef;margin-right:3px;"></span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#9333ea;margin-right:3px;"></span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#6d28d9;margin-right:10px;"></span><span style="font-size:21px;font-weight:700;color:#374151;letter-spacing:-.02em;vertical-align:middle;">${SITE_NAME}</span>
                </td>
              </tr>

              <tr>
                <td style="padding:28px 32px;text-align:left;">

                  <p
                    style="margin:0 0 16px;font-size:13px;line-height:1.7;color:#374151;text-align:left;"
                  >
                    Dear ${safeName},
                  </p>

                  <p
                    style="margin:0 0 14px;font-size:13px;line-height:1.7;color:#374151;text-align:left;"
                  >
                    Thank you for your message. Here is our reply:
                  </p>

                  <div
                    style="margin:0 0 20px;padding:2px 0 2px 14px;border-left:3px solid #e2e8f0;text-align:left;"
                  >
                    <p
                      style="margin:0;font-size:13px;line-height:1.7;color:#0f172a;white-space:pre-wrap;word-break:break-word;text-align:left;"
                    >
                      ${safeReply}
                    </p>
                  </div>

                  <p
                    style="margin:0;font-size:13px;line-height:1.7;color:#374151;text-align:left;"
                  >
                    ---<br />
                    ${SITE_NAME}<br />
                    <a href="${SITE_URL}" style="color:#2563eb;text-decoration:none;">${SITE_DOMAIN}</a>
                  </p>

                </td>
              </tr>

              <tr>
                <td style="padding:20px 32px 26px;border-top:1px solid #e2e8f0;text-align:center;">
                  <p style="margin:0 0 6px;font-size:11px;">
                    <a href="${SITE_URL}" style="color:#2563eb;text-decoration:underline;">Visit website</a>
                    <span style="color:#94a3b8;"> &nbsp;|&nbsp; </span>
                    <a href="mailto:${ADMIN_EMAIL}" style="color:#2563eb;text-decoration:underline;">Get support</a>
                  </p>
                  <p style="margin:0;font-size:10px;color:#94a3b8;">
                    Copyright &copy; ${currentYear} ${SITE_NAME}. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>
      </table>
    </div>
  `;

  const text = [
    `Dear ${params.recipientName || "there"},`,
    "",
    "Thank you for your message. Here is our reply:",
    "",
    normalizeMessage(params.replyMessage),
    "",
    "---",
    SITE_NAME,
    SITE_URL,
  ].join("\n");

  await transporter.sendMail({
    from: `"${SITE_NAME}" <${from}>`,
    to: params.recipientEmail,
    subject: mailSubject,
    text,
    html,
  });

  return true;
}

/* =========================================
   SUBSCRIBER EMAIL (Header Centered, Body Left)
========================================= */

export async function sendSubscriberEmail(
  params: SubscriberEmailParams
) {
  if (!hasMailConfig()) return false;

  const { from, transporter } = await createMailTransporter();

  const safeMessage = escapeHtml(normalizeMessage(params.message));
  const currentYear = new Date().getFullYear();

  const html = `
    <div style="margin:0;padding:0;background:#eef1f5;font-family:Arial,sans-serif;color:#0f172a;text-align:left;">

      <style>
        @media only screen and (max-width: 640px) {
          .mail-shell { padding: 14px 0 !important; }
          .mail-card { border-radius: 10px !important; }
          .mail-header { padding: 18px !important; }
          .mail-body { padding: 20px 16px !important; }
        }

        @media only screen and (max-width: 420px) {
          .mail-shell { padding: 8px 0 !important; }
          .mail-body p { font-size: 12px !important; }
        }
      </style>

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        class="mail-shell"
        style="width:100%;padding:24px 0;text-align:left;"
      >
        <tr>
          <td align="left" style="text-align:left;">

            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              align="center"
              class="mail-card"
              style="width:100%;max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;text-align:left;"
            >
              <tr>
                <!-- Header centered -->
                <td
                  class="mail-header"
                  align="center"
                  style="padding:22px 32px;background:#f8fafc;border-bottom:1px solid #e2e8f0;text-align:center;"
                >
                  <div style="text-align:center;">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#d946ef;margin-right:3px;"></span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#9333ea;margin-right:3px;"></span><span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:#6d28d9;margin-right:10px;"></span><span style="font-size:21px;font-weight:700;color:#374151;letter-spacing:-.02em;vertical-align:middle;">${SITE_NAME}</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td
                  class="mail-body"
                  style="padding:28px 32px;text-align:left;"
                >
                  <div style="width:100%;text-align:left;">
                    <p
                      style="margin:0;font-size:13px;line-height:1.75;color:#374151;white-space:pre-wrap;word-break:break-word;text-align:left;display:block;"
                    >
                      ${safeMessage}
                    </p>
                  </div>

                </td>
              </tr>

              <tr>
                <td style="padding:20px 32px 26px;border-top:1px solid #e2e8f0;text-align:center;">
                  <p style="margin:0 0 6px;font-size:11px;">
                    <a href="${SITE_URL}" style="color:#2563eb;text-decoration:underline;">Visit website</a>
                    <span style="color:#94a3b8;"> &nbsp;|&nbsp; </span>
                    <a href="mailto:${ADMIN_EMAIL}" style="color:#2563eb;text-decoration:underline;">Get support</a>
                  </p>
                  <p style="margin:0;font-size:10px;color:#94a3b8;">
                    Copyright &copy; ${currentYear} ${SITE_NAME}. All rights reserved.
                  </p>
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
      normalizeMessage(params.message),
      "",
      `Sent from ${SITE_NAME}'s portfolio.`,
      SITE_URL,
    ].join("\n"),
    html,
  });

  return true;
}

/* =========================================
   CONTACT FORM EMAIL
========================================= */

export async function sendContactFormEmail(
  params: ContactFormEmailParams
) {
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
    normalizeMessage(params.message),
  ].join("\n");

  const safeName = escapeHtml(params.senderName || "Visitor");
  const safeEmail = escapeHtml(params.senderEmail || "N/A");
  const safePhone = escapeHtml(params.phone?.trim() || "N/A");
  const safeSubject = escapeHtml(params.subject?.trim() || "N/A");
  const safeMessage = escapeHtml(normalizeMessage(params.message));

  const html = `
    <div style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;color:#0f172a;text-align:left;">

      <style>
        @media only screen and (max-width: 640px) {
          .mail-shell { padding: 12px 0 !important; }
          .mail-card { border-radius: 12px !important; }
          .mail-header { padding: 16px !important; }
          .mail-header h2 { font-size: 15px !important; }
          .mail-body { padding: 16px !important; }
          .mail-table td {
            display:block !important;
            width:100% !important;
            padding:4px 0 !important;
            text-align:left !important;
          }
        }

        @media only screen and (max-width: 420px) {
          .mail-shell { padding: 8px 0 !important; }
          .mail-header h2 { font-size: 14px !important; }
        }
      </style>

      <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        class="mail-shell"
        style="width:100%;padding:20px 0;text-align:left;"
      >
        <tr>
          <td align="left" style="text-align:left;">

            <table
              role="presentation"
              width="100%"
              cellspacing="0"
              cellpadding="0"
              border="0"
              align="center"
              class="mail-card"
              style="width:100%;max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;text-align:left;"
            >

              <tr>
                <td
                  class="mail-header"
                  style="padding:16px 20px;background:linear-gradient(90deg,#a21caf,#7c3aed,#2563eb);color:#ffffff;text-align:left;"
                >
                  <p
                    style="margin:0;font-size:9px;letter-spacing:.12em;text-transform:uppercase;opacity:.9;text-align:left;"
                  >
                    Portfolio Contact
                  </p>

                  <h2
                    style="margin:5px 0 0;font-size:16px;line-height:1.3;text-align:left;"
                  >
                    New Contact Form Message
                  </h2>
                </td>
              </tr>

              <tr>
                <td
                  class="mail-body"
                  style="padding:20px;text-align:left;"
                >
                  <p
                    style="margin:0 0 14px;font-size:11px;line-height:1.6;color:#334155;text-align:left;"
                  >
                    A new visitor submitted the contact form.
                  </p>

                  <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    class="mail-table"
                    style="width:100%;border-collapse:collapse;text-align:left;"
                  >
                    <tr>
                      <td
                        style="padding:7px 10px 7px 0;width:110px;font-size:10px;color:#64748b;text-align:left;"
                      >
                        Name
                      </td>

                      <td
                        style="padding:7px 0;font-size:11px;font-weight:600;color:#0f172a;word-break:break-word;text-align:left;"
                      >
                        ${safeName}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="padding:7px 10px 7px 0;width:110px;font-size:10px;color:#64748b;text-align:left;"
                      >
                        Email
                      </td>

                      <td
                        style="padding:7px 0;font-size:11px;font-weight:600;color:#0f172a;word-break:break-word;text-align:left;"
                      >
                        ${safeEmail}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="padding:7px 10px 7px 0;width:110px;font-size:10px;color:#64748b;text-align:left;"
                      >
                        Phone
                      </td>

                      <td
                        style="padding:7px 0;font-size:11px;font-weight:600;color:#0f172a;word-break:break-word;text-align:left;"
                      >
                        ${safePhone}
                      </td>
                    </tr>

                    <tr>
                      <td
                        style="padding:7px 10px 7px 0;width:110px;font-size:10px;color:#64748b;text-align:left;"
                      >
                        Subject
                      </td>

                      <td
                        style="padding:7px 0;font-size:11px;font-weight:600;color:#0f172a;word-break:break-word;text-align:left;"
                      >
                        ${safeSubject}
                      </td>
                    </tr>
                  </table>

                  <div
                    class="mail-message"
                    style="margin-top:14px;padding:12px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;text-align:left;"
                  >
                    <p
                      style="margin:0 0 7px;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:#64748b;text-align:left;"
                    >
                      Message
                    </p>

                    <p
                      style="margin:0;font-size:12px;line-height:1.6;color:#0f172a;white-space:pre-wrap;word-break:break-word;text-align:left;"
                    >
                      ${safeMessage}
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
    from,
    to: ADMIN_EMAIL,
    subject: mailSubject,
    text,
    html,
    replyTo: params.senderEmail,
  });

  return true;
}