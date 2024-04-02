import nodemailer from "nodemailer";
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

async function sendVerificationEmail(email: string, token: string) {
  const {
    HOST,
    SERVER_PORT,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD,
  } = process.env;
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    auth: {
      user: MAIL_USERNAME,
      pass: MAIL_PASSWORD,
    },
  } as SMTPTransport.Options);

  const linkUrl = `http://${HOST}:${SERVER_PORT}/api/auth/verify-email/?token=${token}`;
  await transporter.sendMail({
    from: "chatApp@server.com",
    to: email,
    subject: "Verification letter",
    html: `<p>Please, follow this <a href=${linkUrl}>link</a> to complete email verification</p>`,
  });
}

export default sendVerificationEmail;
