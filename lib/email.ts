type LiveChatEmailParams = {
  senderName: string;
  senderEmail: string;
  message: string;
  visitorId?: string;
};

const ADMIN_EMAIL = process.env.NODEMAILER_TO || "hasnat.dev.26@gmail.com";

function hasMailConfig() {
  return Boolean(
    (process.env.NODEMAILER_USER || process.env.SMTP_USER) &&
      (process.env.NODEMAILER_PASS || process.env.SMTP_PASS)
  );
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
  const text = [
    "A new visitor message arrived from website live chat.",
    "",
    `Visitor Name: ${params.senderName}`,
    `Visitor Email: ${params.senderEmail}`,
    `Visitor ID: ${params.visitorId || "N/A"}`,
    "",
    "Message:",
    params.message,
  ].join("\n");

  await transporter.sendMail({
    from,
    to: ADMIN_EMAIL,
    subject,
    text,
  });

  return true;
}
