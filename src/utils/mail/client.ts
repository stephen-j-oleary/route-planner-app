import * as eHandlebars from "express-handlebars";
import nm from "nodemailer";
import nmHandlebars from "nodemailer-express-handlebars";

export default function createMailClient() {
  const host = process.env.LOOP_MAIL_HOST,
        port = process.env.LOOP_MAIL_PORT,
        user = process.env.LOOP_MAIL_USER,
        pass = process.env.LOOP_MAIL_PASS;
  if (!host || !port || !user || !pass) throw new Error("Invalid environment: Missing mail variables");

  const mailClient = nm.createTransport({
    host,
    port: +port,
    secure: false,
    auth: { user, pass },
  });

  const viewEngine = eHandlebars.create({
    defaultLayout: false,
  });

  mailClient.use("compile", nmHandlebars({
    viewEngine,
    viewPath: "./src/utils/mail/views",
  }));

  return mailClient;
}