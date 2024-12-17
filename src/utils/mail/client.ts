import nm from "nodemailer";

import env from "@/utils/env";


export default function createMailClient() {
  const host = env("LOOP_MAIL_HOST"),
        port = env("LOOP_MAIL_PORT"),
        user = env("LOOP_MAIL_USER"),
        pass = env("LOOP_MAIL_PASS");
  if (!host || !port || !user || !pass) throw new Error("Invalid environment: Missing mail variables");

  const mailClient = nm.createTransport({
    host,
    port: +port,
    secure: false,
    auth: { user, pass },
  });

  return mailClient;
}