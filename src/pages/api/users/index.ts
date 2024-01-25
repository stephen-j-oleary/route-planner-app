import { isArray, isNil, isString, isUndefined, omitBy } from "lodash";
import mongoose from "mongoose";

import User, { userPublicFields } from "@/models/User";
import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import { handleDeleteAccounts } from "@/pages/api/accounts";
import { handleDeleteCustomers } from "@/pages/api/pay/customers";
import { ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);


export type ApiGetUsersQuery = {
  _id?: string | mongoose.Types.ObjectId,
  email?: string,
};
export type ApiGetUsersAuthorizedResponse = Awaited<ReturnType<typeof handleGetUsers>>;
export type ApiGetUsersUnauthorizedResponse = Pick<ApiGetUsersAuthorizedResponse[number], typeof userPublicFields[number]>[];
export type ApiGetUsersResponse =
  | ApiGetUsersAuthorizedResponse
  | ApiGetUsersUnauthorizedResponse;

export async function handleGetUsers(query: ApiGetUsersQuery) {
  return await User.find(query).lean().exec()
}

export async function handleGetUsersUnauthorized(query: ApiGetUsersQuery) {
  return await User.find(query, userPublicFields).lean().exec();
}

handler.get(
  async (req, res) => {
    const authUser = await getAuthUser(req, res);

    let { _id, email } = req.query;
    if (isArray(_id)) _id = _id[0];
    if (isArray(email)) email = email[0];
    const query = omitBy({ _id, email }, isNil);

    const isAuthorized = !!authUser?.id && (!_id || compareMongoIds(authUser.id, _id));

    const users = await (
      isAuthorized
        ? handleGetUsers({ ...query, _id: authUser.id })
        : handleGetUsersUnauthorized(query)
    );

    res.status(200).json(users);
  }
);

handler.post(async (req, res) => {
  const { body } = req;

  const user = await User.create({
    name: body.name,
    email: body.email,
    image: body.image,
  });

  return res.status(201).json(user.toJSON());
});


export type ApiDeleteUsersQuery = {
  email: string,
}
export type ApiDeleteUsersResponse = Awaited<ReturnType<typeof handleDeleteUsers>>

export async function handleDeleteUsers(query: ApiDeleteUsersQuery) {
  await handleDeleteCustomers(query);
  await handleDeleteAccounts(query);
  return await User.deleteMany(query);
}

handler.delete(
  authorization({ isUser: true }),
  async (req, res) => {
    const { email } = req.query;
    if (isUndefined(email)) throw new RequestError("Missing required param: 'email'");
    if (!isString(email)) throw new RequestError("Invalid param: 'email'");
    const query = { email };

    const authUser = await getAuthUser(req, res);
    if (email !== authUser.email) throw new ForbiddenError();

    const { deletedCount } = await handleDeleteUsers(query);
    if (deletedCount === 0) throw new NotFoundError();

    res.status(204).end();
  }
)


export default handler;