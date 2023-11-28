import { isArray, isString } from "lodash";
import mongoose from "mongoose";

import User from "@/shared/models/User";
import nextConnect from "@/shared/nextConnect";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { ForbiddenError, NotFoundError, RequestError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);

export type ApiHeadUserQuery = { id: string };

handler.head(
  isUserAuthenticated,
  async (req, res) => {
    const { id } = req.query;

    if (!isString(id)) throw new RequestError("");

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser._id, id)) throw new ForbiddenError("");

    const user = await handleGetUserById(id);
    if (!user) throw new NotFoundError("");

    res.status(200).send(null);
  }
);

export interface ApiGetUserQuery {
  id: string | mongoose.Types.ObjectId;
}
export type ApiGetUserResponse = Awaited<ReturnType<typeof handleGetUserById>>;

export async function handleGetUserById(id: ApiGetUserQuery["id"]) {
  return await User.findById(id).lean().exec();
}

handler.get(
  isUserAuthenticated,
  async (req, res) => {
    let { id } = req.query;
    if (isArray(id)) id = id[0];
    if (!isString(id)) throw new RequestError("Invalid id");

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser._id, id)) throw new ForbiddenError();

    const user = await handleGetUserById(id);
    if (!user) throw new NotFoundError();

    res.status(200).json(user);
  }
);

handler.patch(
  isUserAuthenticated,
  async (req, res) => {
    const { query, body } = req;
    const { id } = query;

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser._id, id)) throw new ForbiddenError();

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
  isUserAuthenticated,
  async (req, res) => {
    const { id } = req.query;

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser._id, id)) throw new ForbiddenError();

    await User.findByIdAndDelete(id);

    res.status(204).end();
  }
);

export default handler;