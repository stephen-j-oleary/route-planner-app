"use server";

import { getIronSession, SessionOptions } from "iron-session";
import { revalidatePath } from "next/cache";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

import EmailVerifier from "./EmailVerifier";
import stripeClientNext from "../stripeClient/next";
import { getIpGeocode } from "@/app/api/geocode/actions";
import Account from "@/models/Account";
import User, { IUser } from "@/models/User";
import { PostUserBodySchema } from "@/models/User/schemas";
import { ApiError } from "@/utils/apiError";
import connectMongoose from "@/utils/connectMongoose";
import { getCurrentPath } from "@/utils/currentPath";
import pages from "pages";


export type AuthData =
  & Partial<IUser>
  & { userId?: string };

export type AuthContext =
  | ReturnType<() => ReadonlyRequestCookies>
  | { req: NextRequest, res: NextResponse };


export type SignInAccountData = {
  email: string,
  password: string,
  link?: boolean,
};


async function handleUpdateSession(userId: string) {
  const user = await User.findById(userId).lean().exec();
  if (!user) throw new ApiError(404, "User not found");

  return await updateAuth(user, cookies());
}

async function handleLinkAccount(userId: string, { email, password }: { email: string, password: string }) {
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

async function handleCheckAccount({ email, password }: { email: string, password: string }) {
  const user = (
    await User.findOne({ email }).lean().exec()
    ?? (await User.create({ email })).toJSON()
  );
  if (!user) throw new ApiError(403, "Failed to find or create user");
  if (!user.emailVerified) await EmailVerifier().send(user, "welcome");

  if (!user.customerId) {
    await stripeClientNext.customers.create({ email });
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


export async function auth(ctx: AuthContext) {
  const sessionOptions = getSessionOptions();

  return await (
    "req" in ctx
      ? getIronSession<AuthData>(ctx.req, ctx.res, sessionOptions)
      : getIronSession<AuthData>(ctx, sessionOptions)
  );
}


export async function signIn(data: SignInAccountData) {
  const { userId } = await auth(cookies());

  await connectMongoose();

  const { link, ...body } = await PostUserBodySchema.validate(data);

  let _userId = userId;
  if (!userId || link) {
    _userId = ((userId && link)
      ? await handleLinkAccount(userId, body)
      : await handleCheckAccount(body))._id.toString();
  }

  const session = await handleUpdateSession(_userId!);

  revalidatePath(pages.root, "layout");

  return session;
}


export async function signOut() {
  const session = await auth(cookies());
  session.destroy();

  revalidatePath(pages.root, "layout");

  return;
}


export async function updateAuth(data: Partial<IUser> & { id?: string }, ctx: AuthContext) {
  const session = await auth(ctx);

  session.destroy();

  Object.assign(session, data);
  session.userId = data._id?.toString() || data.id;
  session.countryCode = data.countryCode || (await getIpGeocode()).address.countryCode;

  await session.save();

  return session;
}


export async function authRedirect(page: string) {
  const path = await getCurrentPath();
  const query = new URLSearchParams();
  if (path) query.set("callbackUrl", path);
  redirect(`${page}?${query.toString()}`);
}