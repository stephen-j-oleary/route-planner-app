import { render } from "@react-email/render";
import moment from "moment";

import { IUserModel } from "@/models/User";
import { IVerificationTokenModel } from "@/models/VerificationToken";
import createMailClient from "@/utils/mail/client";
import WelcomeEmail from "@/utils/mail/templates/Welcome";


type EmailVerifierModels = {
  User: IUserModel,
  VerificationToken: IVerificationTokenModel,
};

export type EmailVerifierOptions = {
  dbConnect: Promise<unknown>,
  models: EmailVerifierModels,
  mailFrom: string,
};

export default function EmailVerifier({
  dbConnect,
  models,
  mailFrom,
}: EmailVerifierOptions) {
  const {
    User,
    VerificationToken,
  } = models;

  async function _createVerfificationToken(email: string) {
    try { await dbConnect; }
    catch { throw new Error("Failed to connect to database"); }

    // Remove all existing tokens for user
    await VerificationToken.deleteMany({ identifier: email });

    // Create and return a new token
    return await VerificationToken.create({ identifier: email });
  }

  async function send(user: { email: string }, type: "welcome" | "verification" = "welcome") {
    const { token } = await _createVerfificationToken(user.email);

    const mailOptions = {
      from: `Loop Mapping ${mailFrom}`,
      to: user.email,
      subject: type === "welcome"
        ? "Welcome to Loop Mapping"
        : "Loop Mapping Verification Code",
      html: render(
        <WelcomeEmail
          variant={type}
          verificationCode={token}
          supportEmail={mailFrom}
        />
      ),
    };
    try {
      createMailClient().sendMail(mailOptions);
    }
    catch (err) {
      if (err instanceof Error) throw new Error(`Failed to send email: ${err.message}`);
      throw new Error("Failed to send email");
    }
  }

  async function verify(user: { email: string }, code: string) {
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

  return {
    send,
    verify,
  };
}