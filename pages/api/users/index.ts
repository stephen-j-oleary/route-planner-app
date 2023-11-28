import { isArray, isNil, omitBy } from "lodash";
import mongoose from "mongoose";

import User, { userPublicFields } from "@/shared/models/User";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


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

    const isAuthorized = !!authUser?._id && (!_id || compareMongoIds(authUser._id, _id));

    const users = await (
      isAuthorized
        ? handleGetUsers({ ...query, _id: authUser._id })
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


export default handler;