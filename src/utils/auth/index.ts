"use server";

import { getIronSession, SessionOptions } from "iron-session";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { IUser } from "@/models/User";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export type AuthData = {
  userId?: string,
  email?: string,
  image?: string,
  customerId?: string,
  emailVerified?: boolean,
};

export type AuthContext =
  | ReturnType<() => ReadonlyRequestCookies>
  | { req: NextRequest, res: NextResponse };


export async function auth(ctx: AuthContext) {
  const sessionOptions = getSessionOptions();

  return await (
    "req" in ctx
      ? getIronSession<AuthData>(ctx.req, ctx.res, sessionOptions)
      : getIronSession<AuthData>(ctx, sessionOptions)
  );
}


export async function updateAuth(user: IUser, ctx: AuthContext) {
  const session = await auth(ctx);

  session.userId = user._id.toString();
  session.email = user.email;
  session.image = user.image || undefined;
  session.customerId = user.customerId;
  session.emailVerified = !!user.emailVerified;

  await session.save();

  return session;
}

export async function removeAuth(ctx: AuthContext) {
  const session = await auth(ctx);
  session.destroy();
  return;
}


export type SignInAccountData = {
  email: string,
  password: string,
};

export async function signIn(accountData: SignInAccountData) {
  const data = await fetchJson<AuthData>(
    pages.api.signin,
    {
      method: "POST",
      data: accountData,
    },
  );

  return data;
}


export async function signOut() {
  await fetchJson(
    pages.api.session,
    {
      method: "DELETE",
    },
  );

  return;
}


export async function getSession() {
  return await fetchJson<AuthData>(
    pages.api.session,
    {
      method: "GET",
      credentials: "include",
    },
  );
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