import { getIronSession, SessionOptions } from "iron-session";
import { pick } from "lodash-es";

import auth from ".";
import { AuthContext, AuthData, FlowOptions } from "./utils";
import { getIpGeocode } from "@/app/api/geocode/actions";
import { getUserCustomer } from "@/app/api/user/customer/actions";
import Account from "@/models/Account";
import User from "@/models/User";
import pages from "@/pages";
import { ApiError } from "@/utils/apiError";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose"
import { fromMongoose } from "@/utils/mongoose";


const AUTH_FLOW = [
  {
    page: pages.login,
    isDone: (session: AuthData) => !!session.user?.id,
    error: { code: 401, message: "Unauthorized user" },
  },
  {
    page: pages.verify,
    isDone: (session: AuthData) => !!session.user?.emailVerified,
    error: { code: 401, message: "Unauthorized user" },
  },
  {
    page: pages.plans,
    isDone: (session: AuthData) => {
      const customer = session.customer;
      if (!customer?.id) return false;

      const subscriptions = session.subscriptions ?? [];
      return !!subscriptions.length;
    },
    error: { code: 403, message: "Not subscribed" },
  },
];


export async function _getFirstAuthIssue(session: AuthData, { steps, skipSteps }: Pick<FlowOptions, "steps" | "skipSteps"> = {}) {
  for (const step of AUTH_FLOW) {
    if (steps && !steps.includes(step.page)) continue;
    if (skipSteps?.includes(step.page)) continue;

    if (!step.isDone(session)) return step;
  }
}



function _getSessionOptions(): SessionOptions {
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

export async function _getSession(ctx: AuthContext) {
  const sessionOptions = _getSessionOptions();

  return await (
    "req" in ctx
      ? getIronSession<AuthData>(ctx.req, ctx.res, sessionOptions)
      : getIronSession<AuthData>(ctx, sessionOptions)
  );
}


export async function _handleLinkAccount(ctx: AuthContext, { email, password }: { email: string, password: string }) {
  const { user: { id: userId } = {} } = await auth(ctx).session();
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


export async function _handleCheckAccount(ctx: AuthContext, { email, password }: { email: string, password: string }) {
  const { user: { id: userId } = {} } = await auth(ctx).session();
  if (userId) throw new ApiError(404, "Already signed in");

  await connectMongoose();

  const user = (
    await User.findOne({ email }).lean().exec()
    ?? (await User.create({ email })).toJSON()
  );
  if (!user) throw new ApiError(403, "Failed to find or create user");
  if (!user.emailVerified) await EmailVerifier().send(user, "welcome");

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
  const session = await auth(ctx).session();

  const id = userId ?? session.user?.id;
  if (!id) return session;

  await connectMongoose();

  const user = fromMongoose(await User.findById(id).lean().exec());
  if (!user) throw new ApiError(404, "User not found");

  session.user = {
    ...user,
    countryCode: user.countryCode ?? (await getIpGeocode()).address.countryCode,
  };

  const customer = await getUserCustomer()
    .catch(err => {
      console.error(err);
      return undefined;
    });
  if (customer) {
    session.customer = pick(customer, ["id", "balance"]);
    session.subscriptions = customer.subscriptions?.data.map(item => pick(item, "id")) ?? [];
  }

  console.log(session);

  await session.save();

  return session;
}