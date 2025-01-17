import { getIronSession, SessionOptions } from "iron-session";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import EmailVerifier from "./EmailVerifier";
import { getIpGeocode } from "@/app/api/geocode/actions";
import Account from "@/models/Account";
import User, { IUser } from "@/models/User";
import { ApiError } from "@/utils/apiError";
import connectMongoose from "@/utils/connectMongoose";
import { getCurrentPath } from "@/utils/currentPath";
import stripeClientNext from "@/utils/stripeClient/next";
import { appendQuery } from "@/utils/url";


export type AuthData =
  & Partial<IUser>
  & { userId?: string };

export type AuthContext =
  | ReturnType<() => ReadonlyRequestCookies>
  | { req: NextRequest, res: NextResponse };


function getSessionOptions(): SessionOptions {
  const cookieName = process.env.LOOP_AUTH_COOKIE;
  const password = process.env.LOOP_AUTH_SECRET;
  const ttl = +(process.env.LOOP_AUTH_TTL || 0);
  const nodeEnv = process.env.NODE_ENV;

  if (!cookieName || !password || !nodeEnv) throw new Error("Missing cookie name or password");

  return {
    password,
    cookieName,
    ttl,
    cookieOptions: {
      httpOnly: true,
      secure: nodeEnv !== "development",
    },
  };
}


export async function _handleLinkAccount({ email, password }: { email: string, password: string }) {
  const { userId } = await auth(cookies());
  if (!userId) throw new ApiError(401, "Not authorized");

  await connectMongoose();

  const user = await User.findById(userId).lean().exec();
  if (!user) throw new ApiError(404, "User not found");
  if (user.email !== email) throw new ApiError(403, "User not authorized");

  const account = await Account
    .create({
      type: "credentials",
      provider: "credentials",
      userId: user._id.toString(),
      credentials_email: email,
      credentials_password: password,
    })
    .catch(() => null);
  if (!account) throw new ApiError(500, "Failed to link account");

  return user;
}


export async function _handleCheckAccount({ email, password }: { email: string, password: string }) {
  const { userId } = await auth(cookies());
  if (userId) throw new ApiError(404, "Already signed in");

  await connectMongoose();

  const user = (
    await User.findOne({ email }).lean().exec()
    ?? (await User.create({ email })).toJSON()
  );
  if (!user) throw new ApiError(403, "Failed to find or create user");
  if (!user.emailVerified) await EmailVerifier().send(user, "welcome");

  if (!user.customerId) {
    const customer = await stripeClientNext.customers.create({ email });
    await User.updateOne(
      { email },
      { $set: { customerId: customer.id } },
    );
  }

  const accounts = await Account.find({ userId: user._id }).exec();
  const credentialsAccount = accounts.length
    ? accounts.find(acc => acc.type === "credentials")
    : await Account
      .create({
        type: "credentials",
        provider: "credentials",
        userId: user._id.toString(),
        credentials_email: email,
        credentials_password: password,
      })
      .catch(() => {
        throw new ApiError(403, "Failed to create account");
      });
  if (!credentialsAccount) throw new ApiError(403, "Invalid credentials");

  const credentialsOk = await credentialsAccount.checkCredentials({ email, password });
  if (!credentialsOk) throw new ApiError(403, "Invalid credentials");

  return user;
}


export async function _updateAuth(ctx: AuthContext, userId?: string) {
  const session = await auth(ctx);

  const id = userId ?? session.userId;
  if (!id) return session;

  await connectMongoose();

  const user = await User.findById(id).lean().exec();
  if (!user) throw new ApiError(404, "User not found");

  session.destroy();

  Object.assign(session, user);
  session.userId = user._id.toString();
  session.countryCode = user.countryCode || (await getIpGeocode()).address.countryCode;

  await session.save();

  return session;
}


export async function auth(ctx: AuthContext) {
  const sessionOptions = getSessionOptions();

  return await (
    "req" in ctx
      ? getIronSession<AuthData>(ctx.req, ctx.res, sessionOptions)
      : getIronSession<AuthData>(ctx, sessionOptions)
  );
}


export function authRedirect(page: string) {
  const path = getCurrentPath();
  redirect(appendQuery(page, { callbackUrl: path }));
}