import { isArray, isString } from "lodash";
import mongoose from "mongoose";

import { handleGetAccountById } from ".";
import { IAccount } from "@/shared/models/Account";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { AuthError, ForbiddenError, NotFoundError, RequestError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);


export type ApiPatchAccountCredentialsQuery = {
  id: string | mongoose.Types.ObjectId,
};
export type ApiPatchAccountCredentialsBody = {
  email: string,
  password: string,
  oldCredentials: {
    email: string,
    password: string,
  },
};
export type ApiPatchAccountCredentialsResponse = mongoose.FlattenMaps<IAccount>;

handler.patch(async (req, res) => {
  let { id } = req.query;
  if (isArray(id)) id = id[0];
  if (!isString(id)) throw new RequestError("Invalid param: 'id'");

  const { oldCredentials, email, password } = req.body;
  if (!("email" in oldCredentials && isString(oldCredentials.email))) throw new RequestError("Invalid param: 'oldCredentials.email'");
  if (!("password" in oldCredentials && isString(oldCredentials.password))) throw new RequestError("Invalid param: 'oldCredentials.password'");
  if (!isString(email)) throw new RequestError("Invalid param: 'email'");
  if (!isString(password)) throw new RequestError("Invalid param: 'password'");

  const authUser = await getAuthUser(req, res);
  if (!authUser?.id) throw new AuthError();

  const account = await handleGetAccountById(id, { lean: false });
  if (!account) throw new NotFoundError();

  if (!compareMongoIds(authUser.id, account.userId)) throw new ForbiddenError();
  if (!(await account.checkCredentials(oldCredentials))) throw new AuthError("Invalid credentials");

  account.credentials_email = email;
  account.credentials_password = password;
  const updatedAccount = await account.save();

  res.status(200).json(updatedAccount.toJSON());
});

export default handler;