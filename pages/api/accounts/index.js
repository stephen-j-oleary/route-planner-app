import { isUndefined, omitBy } from "lodash";

import Account from "@/shared/models/Account";
import User from "@/shared/models/User";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.head(async (req, res) => {
  const filter = createAccountFilter(req);

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401 };

  let accounts = await Account.find(filter).lean().exec();
  if (!accounts) throw { status: 404 };
  accounts = accounts.filter(a => compareMongoIds(authUser._id, a.userId));

  res.status(200).end();
});

handler.get(async (req, res) => {
  const filter = createAccountFilter(req);

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401, message: "Not authorized" };

  let accounts = await Account.find(filter).lean().exec();
  if (!accounts) throw { status: 404, message: "Resource not found" };
  accounts = accounts.filter(a => compareMongoIds(authUser._id, a.userId));

  return res.status(200).json(accounts);
});

handler.post(async (req, res) => {
  const { body } = req;
  const { userId } = body;

  const user = await User.findById(userId, { _id: 1 }).lean().exec();
  if (!user) throw { status: 409, message: "User resource does not exist" };

  const accounts = await Account.find({ userId }, { _id: 1 }).lean().exec();
  const authUser = await getAuthUser(req, res);

  if (accounts.length && (!authUser?._id || !compareMongoIds(authUser._id, userId))) throw { status: 401, message: "Not authorized" };

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

export default handler;


function createAccountFilter({ query }) {
  return omitBy({
    userId: query.userId,
    provider: query.provider,
  }, isUndefined);
}