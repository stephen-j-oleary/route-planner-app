
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import MongooseAdapter from "next-auth-mongoose-adapter";

import Account from "@/shared/models/Account";
import User from "@/shared/models/User";
import PasswordProvider from "@/shared/utils/auth/PasswordProvider";
import connectMongoose from "@/shared/utils/connectMongoose";


const dbConnect = connectMongoose();
const models = {
  user: User,
  account: Account,
};

/**
 * @type {import("next-auth").AuthOptions}
 */
export const authOptions = {
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_ID,
      clientSecret: process.env.GOOGLE_AUTH_SECRET,
    }),
    PasswordProvider(dbConnect, models),
  ],
  adapter: MongooseAdapter(dbConnect, models),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) session.user._id = token.userId;
      if (token?.userId) {
        const user = await User.findById(token.userId).lean().exec();
        token.email = user.email;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
        session.user.customerId = user.customerId;
      }

      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) token.userId = user._id;
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


export default NextAuth(authOptions);
