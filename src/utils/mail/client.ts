import nm from "nodemailer";


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

  return mailClient;
}