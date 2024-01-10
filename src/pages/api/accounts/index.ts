import { isArray, isNil, isString, isUndefined, omitBy } from "lodash";
import mongoose from "mongoose";

import Account, { accountPublicFields } from "@/models/Account";
import User from "@/models/User";
import nextConnect from "@/nextConnect";
import authMiddleware from "@/nextConnect/middleware/auth";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import { ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import compareMongoIds from "@/utils/compareMongoIds";
import hasOneOf from "@/utils/hasOneOf";


const handler = nextConnect();

handler.use(mongooseMiddleware);


export type ApiGetAccountsQuery = {
  userId?: string | mongoose.Types.ObjectId,
  provider?: string,
};
export type ApiGetAccountsAuthorizedResponse = Awaited<ReturnType<typeof handleGetAccounts>>;
export type ApiGetAccountsUnauthorizedResponse = Pick<ApiGetAccountsAuthorizedResponse[number], typeof accountPublicFields[number]>[];
export type ApiGetAccountsResponse =
  | ApiGetAccountsAuthorizedResponse
  | ApiGetAccountsUnauthorizedResponse;

export async function handleGetAccounts(query: ApiGetAccountsQuery) {
  const accounts = await Account.find(query).lean().exec();
  return accounts || [];
}

export async function handleGetAccountsUnauthorized(query: ApiGetAccountsQuery) {
  const accounts = await Account.find(query, accountPublicFields).lean().exec();
  return accounts || [];
}

handler.get(
  async (req, res) => {
    let { userId, provider } = req.query;
    if (isArray(userId)) userId = userId[0];
    if (isArray(provider)) provider = provider[0];
    const query = omitBy({ userId, provider }, isNil);

    const authUser = await getAuthUser(req, res);
    const isAuthorized = !!authUser?.id && (!userId || userId === authUser.id);

    const accounts = await (
      isAuthorized
        ? handleGetAccounts({ ...query, userId: authUser.id })
        : handleGetAccountsUnauthorized(query)
    );

    return res.status(200).json(accounts);
  }
);

handler.post(async (req, res) => {
  const { body } = req;
  const { userId } = body;

  const user = await User.findById(userId, { _id: 1 }).lean().exec();
  if (!user) throw { status: 409, message: "User resource does not exist" };

  const accounts = await Account.find({ userId }, { _id: 1 }).lean().exec();
  const authUser = await getAuthUser(req, res);

  if (accounts.length && (!authUser?.id || !compareMongoIds(authUser.id, userId))) throw { status: 401, message: "Not authorized" };

  const account = await Account.create({
    userId: body.userId,
    type: body.type,
    provider: body.provider,
    providerAccountId: body.providerAccountId,
    refresh_token: body.refreshToken,
    access_token: body.accessToken,
    expires_at: body.expiresAt,
    token_type: body.tokenType,
    scope: body.scope,
    id_token: body.idToken,
    session_state: body.sessionState,
    oauth_token_secret: body.oauthTokenSecret,
    oauth_token: body.oauthToken,
    credentials: body.credentials,
  });
  return res.status(201).json(account);
});


export type ApiDeleteAccountsQuery =
  | { userId: string, email?: string }
  | { userId?: string, email: string }
export type ApiDeleteAccountsResponse = Awaited<ReturnType<typeof handleDeleteAccounts>>

export async function handleDeleteAccounts(query: ApiDeleteAccountsQuery) {
  return await Account.deleteMany(query);
}

handler.delete(
  authMiddleware({ requireAccount: true, requireSubscription: false }),
  async (req, res) => {
    const { userId, email } = req.query;
    if (!isUndefined(userId) && !isString(userId)) throw new RequestError("Invalid param: 'userId'");
    if (!isUndefined(email) && !isString(email)) throw new RequestError("Invalid param: 'email'");
    const query = omitBy({ userId, email }, isNil);
    if (!hasOneOf(query, ["userId", "email"])) throw new RequestError("Missing required param: 'userId' or 'email'");

    const authUser = await getAuthUser(req, res);
    if (userId && userId !== authUser.id) throw new ForbiddenError();
    if (email && email !== authUser.email) throw new ForbiddenError();

    const { deletedCount } = await handleDeleteAccounts(query);
    if (deletedCount === 0) throw new NotFoundError();

    res.status(204).end();
  }
);

export default handler;