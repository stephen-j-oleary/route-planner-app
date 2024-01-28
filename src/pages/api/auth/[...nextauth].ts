import { NextApiRequest, NextApiResponse } from "next";
import { AuthOptions } from "next-auth";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import Account from "@/models/Account";
import Session from "@/models/Session";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import { handleGetAccounts, handlePostAccount } from "@/pages/api/accounts";
import { handleGetUserById } from "@/pages/api/users/[id]";
import { NextRequest, NextResponse } from "@/types/next";
import MongooseAdapter from "@/utils/auth/MongooseAdapter";
import PasswordProvider from "@/utils/auth/PasswordProvider";
import connectMongoose from "@/utils/connectMongoose";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const GOOGLE_CLIENT_ID = process.env.NEXTAUTH_GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXTAUTH_GOOGLE_SECRET;

if (!NEXTAUTH_SECRET) throw new Error("Missing NextAuth secret");
if (!GOOGLE_CLIENT_ID) throw new Error("Missing Google client id");
if (!GOOGLE_CLIENT_SECRET) throw new Error("Missing Google client secret");


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
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
      }),
      PasswordProvider(dbConnect, models),
    ],
    adapter: MongooseAdapter(dbConnect, models),
    session: {
      strategy: "jwt",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    callbacks: {
      // Additional logic to handle creating multiple signIn methods per user
      async signIn({ account }) {
        if (!account) return true; // Continue to the default signIn handling

        // Check the current session for a logged in user
        const currentSession = await getServerSession(req, res, extendedOptions);
        const currentUserId = currentSession?.user?.id;
        if (!currentUserId) return true; // User is not signed in; Continue to default signIn handling

        // Attempt to link a new account
        // Check if user already has an account with the provider
        const existingAccounts = await handleGetAccounts({
          userId: currentUserId,
          provider: account.provider,
        });
        if (existingAccounts.length) throw new Error("OAuthAccountInUse");

        // Link the new account
        await handlePostAccount({
          type: "oauth",
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          userId: currentUserId,
        });

        return true; // Continue to default signIn handling
      },
      async session({ session, token }) {
        if (session?.user && token.userId) session.user.id = token.userId;
        if (token?.userId) {
          const user = await handleGetUserById(token.userId);
          token.email = user?.email;
          session.user.name = user?.name;
          session.user.email = user?.email;
          session.user.image = user?.image;
          session.user.customerId = user?.customerId;
        }

        return session;
      },
      async jwt({ user, token }) {
        if (user) token.userId = user.id;
        return token;
      },
    },
    secret: NEXTAUTH_SECRET,
  };

  return extendedOptions;
};


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, getNextAuthOptions(req, res));
}