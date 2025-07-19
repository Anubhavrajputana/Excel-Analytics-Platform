import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email using the configured SMTP service
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Plain text message
 */
export const sendMail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Excel Analytics Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    throw new Error("Email failed to send");
  }
};
