import { isArray, isString } from "lodash";
import mongoose from "mongoose";

import User from "@/models/User";
import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import { ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);


export interface ApiGetUserQuery {
  id: string | mongoose.Types.ObjectId;
}
export type ApiGetUserResponse = Awaited<ReturnType<typeof handleGetUserById>>;

export async function handleGetUserById(id: ApiGetUserQuery["id"]) {
  return await User.findById(id).lean().exec();
}

handler.get(
  authorization({ isUser: true }),
  async (req, res) => {
    let { id } = req.query;
    if (isArray(id)) id = id[0];
    if (!isString(id)) throw new RequestError("Invalid id");

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.id, id)) throw new ForbiddenError();

    const user = await handleGetUserById(id);
    if (!user) throw new NotFoundError();

    res.status(200).json(user);
  }
);

handler.patch(
  authorization({ isUser: true }),
  async (req, res) => {
    const { query, body } = req;
    const { id } = query;

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.id, id)) throw new ForbiddenError();

    const user = await User.findById(id).exec();
    if (!user) throw new NotFoundError();

    for (const key in body) {
      if (!["name", "image"].includes(key)) continue;
      user[key] = body[key];
    }
    const updatedUser = await user.save();

    res.status(200).json(updatedUser.toJSON());
  }
);

handler.delete(
  authorization({ isUser: true }),
  async (req, res) => {
    const { id } = req.query;

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.id, id)) throw new ForbiddenError();

    await User.findByIdAndDelete(id);

    res.status(204).end();
  }
);

export default handler;