import { isArray, isString } from "lodash";
import mongoose from "mongoose";

import { handleGetAccountById } from ".";
import { Credentials, IAccount } from "@/shared/models/Account";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { AuthError, NotFoundError, RequestError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);


export type ApiPatchAccountCredentialsQuery = {
  id: string | mongoose.Types.ObjectId,
};
export type ApiPatchAccountCredentialsBody = Credentials & {
  oldCredentials: Credentials,
};
export type ApiPatchAccountCredentialsResponse = mongoose.FlattenMaps<IAccount>;

handler.patch(async (req, res) => {
  let { id } = req.query;
  if (isArray(id)) id = id[0];
  if (!isString(id)) throw new RequestError("Invalid id");

  const { oldCredentials, email, password } = req.body;
  if (!("email" in oldCredentials && isString(oldCredentials.email))) throw new RequestError("Invalid oldCredentials.email");
  if (!("password" in oldCredentials && isString(oldCredentials.password))) throw new RequestError("Invalid oldCredentials.password");
  if (!isString(email)) throw new RequestError("Invalid email");
  if (!isString(password)) throw new RequestError("Invalid password");

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw new AuthError("Not authorized");

  const account = await handleGetAccountById(id, { lean: false });
  if (!account) throw new NotFoundError();

  if (!compareMongoIds(authUser._id, account.userId)) throw new AuthError("Not authorized");
  if (!(await account.checkCredentials(oldCredentials))) throw new AuthError("Invalid credentials");

  account.credentials = { email, password };
  const updatedAccount = await account.save();

  res.status(200).json(updatedAccount.toJSON());
});

export default handler;