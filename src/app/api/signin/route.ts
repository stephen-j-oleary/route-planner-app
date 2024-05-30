import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import Account from "@/models/Account";
import { PostSigninBodySchema } from "@/models/Session/schemas";
import User from "@/models/User";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth, updateAuth } from "@/utils/auth";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose";


export async function handleUpdateSession(userId: string) {
  await connectMongoose();

  const user = await User.findById(userId).lean().exec();
  if (!user) throw new ApiError(404, "User not found");

  return await updateAuth(user, cookies());
}

export async function handleLinkAccount(userId: string, accountCredentials: { email: string, password: string }) {
  await connectMongoose();

  const user = await User.findById(userId).lean().exec();
  if (!user) throw new ApiError(404, "User not found");
  if (user.email !== accountCredentials.email) throw new ApiError(403, "User not authorized");

  const account = await Account
    .create({
      type: "credentials",
      provider: "credentials",
      userId: user._id.toString(),
      credentials_email: accountCredentials.email,
      credentials_password: accountCredentials.password,
    })
    .catch(() => null);
  if (!account) throw new ApiError(500, "Account link failed");

  return await updateAuth(user, cookies());
}

export async function handleSignIn(accountCredentials: { email: string, password: string }) {
  await connectMongoose();

  const { email, password } = accountCredentials;
  const user = (
    await User.findOne({ email }).lean().exec()
    ?? (await User.create({ email })).toJSON()
  );
  if (!user) throw new ApiError(403, "Failed to find or create user");
  if (!user.emailVerified) await EmailVerifier().send(user, "welcome");

  const accounts = await Account.find({ userId: user._id }).exec();
  const credentialsAccount = accounts.find(acc => acc.type === "credentials");
  if (!credentialsAccount) throw new ApiError(403, "Invalid credentials");

  const credentialsOk = await credentialsAccount.checkCredentials({ email, password });
  if (!credentialsOk) throw new ApiError(403, "Invalid credentials");

  return await updateAuth(user, cookies());
}

export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId } = await auth(cookies());

    const json = await req.json();
    const { link } = json;

    let session;

    if (userId && link !== "true") { // Logged in; Update session
      session = await handleUpdateSession(userId);
    }
    else if (userId && link === "true") { // Logged in; Link a new account
      const body = await PostSigninBodySchema
        .validate(json)
        .catch(err => {
          throw new ApiError(400, err.message);
        });

      session = await handleLinkAccount(userId, body);
    }
    else { // Not signed in; Create or find account
      const body = await PostSigninBodySchema
        .validate(json)
        .catch(err => {
          throw new ApiError(400, err.message);
        });

      session = await handleSignIn(body);
    }

    return NextResponse.json(session);
  }
);