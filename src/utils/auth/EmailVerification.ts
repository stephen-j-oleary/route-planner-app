import moment from "moment";

import connectMongoose from "../connectMongoose";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import mailClient from "@/utils/mail/client";


async function createVerfificationToken(email: string) {
  try { await connectMongoose(); }
  catch { throw new Error("Failed to connect to database"); }

  // Remove all existing tokens for user
  await VerificationToken.deleteMany({ identifier: email });

  // Create and return a new token
  return await VerificationToken.create({ identifier: email });
}

export async function welcome(user: { email: string }) {
  const { token } = await createVerfificationToken(user.email);

  const mailOptions = {
    from: `Loop Mapping ${process.env.MAIL_FROM}`,
    to: user.email,
    subject: "Welcome to Loop Mapping",
    template: "welcome",
    context: {
      verificationCode: token,
      supportEmail: process.env.MAIL_FROM,
    },
  };
  mailClient.sendMail(mailOptions);
}

export async function resend(user: { email: string }) {
  const { token } = await createVerfificationToken(user.email);

  const mailOptions = {
    from: `Loop Mapping ${process.env.MAIL_FROM}`,
    to: user.email,
    subject: "Loop Mapping Verification Code",
    template: "verification",
    context: {
      verificationCode: token,
      supportEmail: process.env.MAIL_FROM,
    },
  };
  mailClient.sendMail(mailOptions);
}

export async function verify(user: { email: string }, code: string) {
  const filter = { identifier: user.email, token: code.toUpperCase() };
  const token = await VerificationToken.findOne(filter);
  if (!token) return false; // Token not found

  // Token should be deleted if it is expired or used
  await VerificationToken.findOneAndDelete(filter);

  // Check if token is expired
  const valid = moment(token.expires).isAfter(moment());
  if (!valid) return false;

  await User.findOneAndUpdate({ email: user.email }, { $set: { emailVerified: Date.now() } });

  return true;
}


const EmailVerification = {
  welcome,
  resend,
  verify,
};

export default EmailVerification;