import { getToken } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

import compareMongoIds from "@/shared/utils/compareMongoIds";
import cookieStringToObject from "@/shared/utils/cookieStringToObject";


const secret = process.env.NEXTAUTH_SECRET

export default function PasswordProvider(
  dbConnect,
  models
) {
  return CredentialsProvider({
    id: "credentials",
    name: "Password",
    credentials: {
      username: { label: "Email", type: "email" },
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
        await models.user.findOne({ email }).lean().exec()
        ?? (await models.user.create({ email })).toJSON()
      );
      if (!user) throw new Error("Server error");

      const accounts = await models.account.find({ userId: user._id }).exec();
      const credentialsAccount = accounts.find(acc => acc.type === "credentials");
      const token = await getToken({
        req: {
          cookies: cookieStringToObject(req.headers?.cookie),
        },
        secret
      });
      const authUser = token?.email && await models.user.findOne({ email: token.email }).exec();

      if (credentialsAccount) {
        const credentialsOk = await credentialsAccount.checkCredentials({ email, password });
        if (!credentialsOk) throw new Error("Invalid credentials");
        return user;
      }

      if (accounts.length && !compareMongoIds(authUser?._id, user._id)) throw new Error("Account link failed");

      const account = await models.account.create({
        type: "credentials",
        provider: "credentials",
        userId: user._id,
        credentials: { email, password },
      });
      if (!account) throw new Error("Account creation failed");

      return user;
    }
  });
}