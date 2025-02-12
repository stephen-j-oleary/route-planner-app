import { SessionOptions } from "iron-session";
import { pick } from "lodash-es";

import { authSession } from ".";
import { AuthData, FlowOptions, parseSearchParams } from "./utils";
import { getIpGeocode } from "@/app/api/geocode/actions";
import Account from "@/models/Account";
import User from "@/models/User";
import pages from "@/pages";
import { ApiError } from "@/utils/apiError";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose"
import { fromMongoose } from "@/utils/mongoose";
import stripeClientNext from "@/utils/stripeClient/next";


type FlowHandler = (opts: FlowOptions & { session: AuthData }) => (
  | { redirect: string }
  | undefined
);

export function isLoggedIn(session: AuthData) {
  return !!session.user?.id;
}

export function isEmailVerified(session: AuthData) {
  return !!session.user?.emailVerified;
}

export function hasSubscriptions(session: AuthData) {
  const customer = session.customer;
  const subscriptions = session.subscriptions ?? [];

  return !!(customer?.id && subscriptions.length);
}

export function isAuthPage(page: string) {
  return AUTH_FLOW.some(step => step[0] === page);
}

export const AUTH_FLOW: [string, FlowHandler][] = [
  [
    pages.login,
    ({ session }) => {
      if (isLoggedIn(session)) return { redirect: pages.login_verify };
    },
  ],
  [
    pages.login_password,
    ({ session, searchParams }) => {
      if (isLoggedIn(session)) return { redirect: pages.login_verify };
      if (typeof searchParams?.email !== "string") return { redirect: pages.login, error: { code: 400, message: "Invalid email" } };
    },
  ],
  [
    pages.login_forgot,
    ({ session }) => {
      if (isLoggedIn(session)) return { redirect: pages.login_verify };
    },
  ],
  [
    pages.login_verify,
    ({ session, searchParams = {}, page }) => {
      const _email = session.user?.email ?? parseSearchParams(searchParams, page).email;
      if (!_email) return { redirect: pages.login };

      if (!isEmailVerified(session)) return;

      const { intent } = parseSearchParams(searchParams ?? {}, page);
      if (intent === "change") return { redirect: pages.login_change };
      return { redirect: !hasSubscriptions(session) ? pages.plans : page };
    },
  ],
  [
    pages.login_change,
    ({ session, page, next }) => {
      if (!isLoggedIn(session)) return { redirect: pages.login };
      if (!isEmailVerified(session)) return { redirect: pages.login_verify };
      if (next) return { redirect: page };
    }
  ],
  [
    pages.plans,
    ({ searchParams = {}, page }) => {
      const { plan } = parseSearchParams(searchParams, page);
      if (plan) return { redirect: `${pages.subscribe}/${plan}` };
    },
  ],
  [
    pages.subscribe,
    ({ session }) => {
      if (!isLoggedIn(session)) return { redirect: pages.login };
      if (hasSubscriptions(session)) return { redirect: pages.plans };
    },
  ],
];

export const AUTH_ERRORS = {
  [pages.login]: { code: 401, message: "Invalid authorization" },
  [pages.login_password]: { code: 401, message: "Invalid authorization" },
  [pages.login_verify]: { code: 401, message: "Invalid authorization" },
  [pages.plans]: { code: 403, message: "Not authorized" },
  [pages.subscribe]: { code: 403, message: "Not authorized" },
};


export function _getNextPage(session: AuthData, opts: FlowOptions) {
  const { page, next, searchParams = {} } = opts;
  const _page = typeof next === "string" && next || page;
  let currPage: string | undefined = _page;
  let nextPage;

  const { callbackUrl } = parseSearchParams(searchParams, _page);

  while (currPage) {
    const stepPage: string = isAuthPage(currPage) ? currPage : AUTH_FLOW[0][0];
    const handler = Object.fromEntries(AUTH_FLOW)[stepPage];
    currPage = handler({ session, ...opts })?.redirect;
    nextPage = currPage ?? stepPage;

    if (nextPage === _page) {
      if (currPage) nextPage = callbackUrl;
      currPage = undefined; // End the loop if nextPage is the current page
    }
  }

  return nextPage;
}



export function _getSessionOptions(): SessionOptions {
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


export async function _handleLinkAccount({ email, password }: { email: string, password?: string }) {
  if (!password) throw new ApiError(400, "Invalid credentials");

  const { user: { id: userId } = {} } = await authSession();
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


export async function _handleCheckAccount({ email, password, code }: { email: string, password?: string, code?: string }) {
  const { user: { id: userId } = {} } = await authSession();
  if (userId) throw new ApiError(404, "Already signed in");

  await connectMongoose();

  const user = (
    await User.findOne({ email }).lean().exec()
    ?? (await User.create({ email })).toJSON()
  );
  if (!user) throw new ApiError(403, "Failed to find or create user");
  if (!user.emailVerified) await EmailVerifier(user).send("welcome");

  if (password) {
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
  }

  if (code) {
    const isValid = await EmailVerifier(user).verify(code);
    if (!isValid) throw new ApiError(403, "Invalid credentials");
  }

  return user;
}


export async function _updateAuth(userId?: string) {
  const session = await authSession();

  const id = userId ?? session.user?.id;
  if (!id) return session;

  await connectMongoose();

  const user = fromMongoose(await User.findById(id).lean().exec());
  if (!user) throw new ApiError(404, "User not found");

  session.user = {
    ...user,
    countryCode: user.countryCode ?? (await getIpGeocode()).address.countryCode,
  };

  const customer = user.email
    ? (await stripeClientNext.customers.list({ email: user.email, expand: ["data.subscriptions.data"] })
      .catch(err => {
        console.error(err);
        return undefined;
      }))?.data[0]
    : undefined;
  if (customer && !customer.deleted) {
    session.customer = pick(customer, ["id", "balance"]);
    session.subscriptions = customer.subscriptions?.data.map(item => pick(item, "id")) ?? [];
  }

  await session.save();

  return session;
}