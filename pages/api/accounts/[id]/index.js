import mongooseMiddleware from "../../../nextConnect/middleware/mongoose";
import Account from "@/shared/models/Account";
import { getPublicFields } from "@/shared/models/helpers/getFields";
import nextConnect from "@/shared/nextConnect";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.head(async (req, res) => {
  const { id } = req.query;
  const projection = await createAccountProjection(req, res);

  const account = await Account.findById(id, projection).lean().exec();
  if (!account) throw { status: 404 };

  res.status(200).send();
});

handler.get(async (req, res) => {
  const { id } = req.query;
  const projection = await createAccountProjection(req, res);

  const account = await Account.findById(id, projection).lean().exec();
  if (!account) throw { status: 404, message: "Resource not found" };

  res.status(200).json(account);
});

handler.patch(async (req, res) => {
  const { query, body } = req;
  const { id } = query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401, message: "Not authorized" };

  const account = await Account.findById(id).exec();
  if (!account) throw { status: 404, message: "Resource not found" };
  if (!compareMongoIds(authUser._id, account.userId)) throw { status: 401, message: "Not authorized" };

  for (const key in body) {
    if (!["type", "provider", "providerAccountId", "refresh_token", "access_token", "expires_at", "token_type", "scope", "id_token", "session_state", "oauth_token_secret", "oauth_token"].includes(key)) continue;
    account[key] = body[key];
  }
  const updatedAccount = await account.save();

  res.status(200).json(updatedAccount.toJSON());
});

handler.delete(async (req, res) => {
  const { id } = req.query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401, message: "Not authorized" };

  const account = await Account.findById(id, ["userId"]).lean().exec();
  if (!account) throw { status: 404, message: "Resource not found" };
  if (!compareMongoIds(authUser._id, account.userId)) throw { status: 401, message: "Not authorized" };

  await Account.findByIdAndDelete(id);

  res.status(204).end();
});

export default handler;


async function createAccountProjection(req, res) {
  const authUser = await getAuthUser(req, res);
  const publicFields = getPublicFields(Account);

  // Only return public fields unless user is authenticated and requesting only their own resources
  return (!req.query?.id || !authUser?._id || req.query.id !== authUser._id)
    ? publicFields
    : null;
}