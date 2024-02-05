import { create } from "express-handlebars";
import nm from "nodemailer";
import nmHandlebars from "nodemailer-express-handlebars";

const host = process.env.MAIL_HOST;
const port = process.env.MAIL_PORT;
const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;
if (!host) throw new Error("Missing mail host");
if (!port) throw new Error("Missing mail port");
if (!user) throw new Error("Missing mail user");
if (!pass) throw new Error("Missing mail pass");


const mailClient = nm.createTransport({
  host,
  port: +port,
  secure: false,
  auth: { user, pass },
});

const viewEngine = create({
  defaultLayout: false,
});

mailClient.use("compile", nmHandlebars({
  viewEngine,
  viewPath: "./src/utils/mail/views",
}));

export default mailClient;