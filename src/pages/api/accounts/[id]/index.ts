import { isArray, isString } from "lodash";
import mongoose from "mongoose";

import Account from "@/models/Account";
import nextConnect from "@/nextConnect";
import authMiddleware from "@/nextConnect/middleware/auth";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import { AuthError, ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);


export type ApiGetAccountByIdQuery = {
  id: string | mongoose.Types.ObjectId,
};
export type ApiGetAccountByIdResponse = Awaited<ReturnType<typeof handleGetAccountById>>;

export async function handleGetAccountById(id: ApiGetAccountByIdQuery["id"], { lean = true }: { lean?: boolean } = {}) {
  return await Account.findById(id, undefined, { lean }).exec();
}

handler.get(
  authMiddleware({ requireAccount: true, requireSubscription: false }),
  async (req, res) => {
    let { id } = req.query;
    if (isArray(id)) id = id[0];
    if (!isString(id)) throw new RequestError("Invalid param: 'id'");

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.id, id)) throw new ForbiddenError();

    const account = await handleGetAccountById(id);
    if (!account) throw new NotFoundError();

    res.status(200).json(account);
  }
);

handler.patch(async (req, res) => {
  const { query, body } = req;
  const { id } = query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?.id) throw new AuthError();

  const account = await Account.findById(id).exec();
  if (!account) throw new NotFoundError();
  if (!compareMongoIds(authUser.id, account.userId)) throw new AuthError();

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
  if (!authUser?.id) throw new AuthError();

  const account = await Account.findById(id, ["userId"]).lean().exec();
  if (!account) throw new NotFoundError();
  if (!compareMongoIds(authUser.id, account.userId)) throw new AuthError();

  await Account.findByIdAndDelete(id);

  res.status(204).end();
});

export default handler;