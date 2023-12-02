import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import { IAccountModel } from "@/shared/models/Account";
import { IUserModel } from "@/shared/models/User";
import compareMongoIds from "@/shared/utils/compareMongoIds";
import { fromMongoose } from "@/shared/utils/mongoose";


const secret = process.env.NEXTAUTH_SECRET


interface PasswordProviderModels {
  User: IUserModel,
  Account: IAccountModel,
}

export default function PasswordProvider(
  dbConnect: Promise<mongoose.Mongoose>,
  models: PasswordProviderModels
) {
  const {
    User,
    Account,
  } = models;

  return CredentialsProvider({
    id: "credentials",
    name: "Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize({ email, password }, req) {
      if (!email || !password) throw new Error("Invalid request");

      try {
        await dbConnect;
      }
      catch {
        throw new Error("Server error");
      }

      // Find or create the user
      const user = (
        await User.findOne({ email }).lean().exec()
        ?? (await User.create({ email })).toJSON()
      );
      if (!user) throw new Error("Server error");

      const accounts = await Account.find({ userId: user._id }).exec();
      const credentialsAccount = accounts.find(acc => acc.type === "credentials");
      const token = await getToken({ req: req as NextRequest, secret });
      const authUser = token?.email && await User.findOne({ email: token.email }).exec();

      if (credentialsAccount) {
        const credentialsOk = await credentialsAccount.checkCredentials({ email, password });
        if (!credentialsOk) throw new Error("Invalid credentials");
        return fromMongoose(user);
      }

      if (accounts.length && !compareMongoIds(authUser?._id, user._id)) throw new Error("Account link failed");

      const account = await Account.create({
        type: "credentials",
        provider: "credentials",
        userId: user._id,
        credentials_email: email,
        credentials_password: password,
      });
      if (!account) throw new Error("Account creation failed");

      return fromMongoose(user);
    }
  });
}