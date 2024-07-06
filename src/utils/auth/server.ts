import "server-only";

import { getIronSession, SessionOptions } from "iron-session";
import { revalidatePath } from "next/cache";

import { AuthContext, AuthData } from ".";
import { IUser } from "@/models/User";
import pages from "pages";


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

  revalidatePath(pages.api.session);

  return session;
}

export async function removeAuth(ctx: AuthContext) {
  const session = await auth(ctx);
  session.destroy();

  revalidatePath(pages.api.signin);
  revalidatePath(pages.api.session);

  return;
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