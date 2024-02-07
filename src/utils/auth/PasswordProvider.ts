import mongoose from "mongoose";
import { getToken } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import EmailVerifier from "./EmailVerifier";
import { IAccountModel } from "@/models/Account";
import { IUserModel } from "@/models/User";
import { IVerificationTokenModel } from "@/models/VerificationToken";
import { NextRequest } from "@/types/next";
import { fromMongoose } from "@/utils/mongoose";


interface PasswordProviderModels {
  User: IUserModel,
  Account: IAccountModel,
  VerificationToken: IVerificationTokenModel,
}

export type PasswordProviderOptions = {
  req: NextRequest,
  dbConnect: Promise<mongoose.Mongoose>,
  models: PasswordProviderModels,
  authSecret: string,
}

export default function PasswordProvider({
  req,
  dbConnect,
  models,
  authSecret,
}: PasswordProviderOptions) {
  const {
    User,
    Account,
  } = models;

  async function createUser(email: string) {
    const user = (await User.create({ email })).toJSON();
    await EmailVerifier({ dbConnect, models }).send(user, "welcome");
    return user;
  }

  return CredentialsProvider({
    id: "credentials",
    name: "Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials) {
      const { email, password } = credentials || {};
      if (!email || !password) throw new Error("Missing email or password");

      try { await dbConnect; }
      catch { throw new Error("Server error"); }

      // Find or create the user
      const user = (
        await User.findOne({ email }).exec()
        ?? (await createUser(email))
      );
      if (!user) throw new Error("Server error");

      const accounts = await Account.find({ userId: user._id }).exec();
      const credentialsAccount = accounts.find(acc => acc.type === "credentials");
      const token = await getToken({ req, secret: authSecret });
      const authEmail = token?.email;

      if (credentialsAccount) {
        const credentialsOk = await credentialsAccount.checkCredentials({ email, password });
        if (!credentialsOk) throw new Error("Invalid credentials");
        return fromMongoose(user);
      }

      if (accounts.length && authEmail !== email) throw new Error("Account link failed");

      try {
        const account = await Account.create({
          type: "credentials",
          provider: "credentials",
          userId: user._id,
          credentials_email: email,
          credentials_password: password,
        });
        if (!account) throw new Error("Account creation failed");
      }
      catch (err) {
        if (err instanceof Error) throw new Error(`Account creation failed: ${err.message}`);
        throw new Error("Account creation failed");
      }

      return fromMongoose(user);
    }
  });
}