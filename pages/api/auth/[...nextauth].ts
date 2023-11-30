import { NextApiRequest, NextApiResponse } from "next";
import { AuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import { handleGetUserById } from "@/pages/api/users/[id]";
import Account from "@/shared/models/Account";
import Session from "@/shared/models/Session";
import User from "@/shared/models/User";
import VerificationToken from "@/shared/models/VerificationToken";
import MongooseAdapter from "@/shared/utils/auth/MongooseAdapter";
import PasswordProvider from "@/shared/utils/auth/PasswordProvider";
import connectMongoose from "@/shared/utils/connectMongoose";
import { NextRequest, NextResponse } from "@/types/next";


const dbConnect = connectMongoose();
const models = {
  User,
  Account,
  Session,
  VerificationToken,
};

export const getNextAuthOptions = (req: NextRequest, res: NextResponse) => {
  const extendedOptions: AuthOptions = {
    pages: {
      signIn: "/login",
      error: "/login",
    },
    providers: [
      GoogleProvider({
        clientId: process.env.NEXTAUTH_GOOGLE_ID,
        clientSecret: process.env.NEXTAUTH_GOOGLE_SECRET,
      }),
      PasswordProvider(dbConnect, models),
    ],
    adapter: MongooseAdapter(dbConnect, models),
    session: {
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    callbacks: {
      async signIn({ account }) {
        const currentSession = await getServerSession(req, res, extendedOptions);
        const currentUserId = currentSession?.user?.id;

        // If there is a user already signed in,
        // and there is an account that is being signed in with
        if (account && currentUserId) {
          // Do the account linking

          // Only link accounts that have not yet been linked
          const existingAccount = await Account.findOne({
            provider: account.provider,
            providerAccountId: account.providerAccountId
          }).lean().exec();
          if (existingAccount) throw new Error("OAuthAccountInUse");

          // Find the account that is currently signed in
          const currentAccount = await Account.findOne({
            userId: currentUserId,
          }).lean().exec();

          // Link the new account
          await Account.create({
            type: "oauth",
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            userId: currentUserId,
          });

          // Remove the signed in account after the new account is created
          await Account.findByIdAndDelete(currentAccount._id);
        }

        return true;
      },
      async session({ session, token }) {
        if (session?.user) session.user.id = token.userId;
        if (token?.userId) {
          const user = await handleGetUserById(token.userId);
          token.email = user.email;
          session.user.name = user.name;
          session.user.email = user.email;
          session.user.image = user.image;
          session.user.customerId = user.customerId;
        }

        return session;
      },
      async jwt({ user, token }) {
        if (user) token.userId = user.id;
        return token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };

  return extendedOptions;
};


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, getNextAuthOptions(req, res));
}