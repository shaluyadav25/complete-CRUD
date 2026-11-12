import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_HOST, SMTP_USER and SMTP_PASS must be configured");
  }

  transporter ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
};

export const verifyMailerConnection = () => getTransporter().verify();

export const sendWelcomeEmail = async ({ email, name }) => {
  await getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Welcome",
    text: `Hi ${name},\n\nWelcome! Your account has been created successfully.`,
  });
};
