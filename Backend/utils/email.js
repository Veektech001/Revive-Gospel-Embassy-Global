import nodemailer from "nodemailer";
import { config } from "./config.js";

const smtpReady = Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);

const transporter = smtpReady
  ? nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    })
  : null;

/**
 * Sends an email. Without SMTP settings the email is printed to the
 * console instead, so password resets can still be tested locally.
 */
export async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    console.log(`\n📧 [email not sent: SMTP not configured]\nTo: ${to}\nSubject: ${subject}\n${text}\n`);
    return { previewOnly: true };
  }
  return transporter.sendMail({ from: config.smtp.from, to, subject, text, html });
}
