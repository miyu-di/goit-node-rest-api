import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

async function sendMail(message) {
    return transport.sendMail(message)
}

export default sendMail;