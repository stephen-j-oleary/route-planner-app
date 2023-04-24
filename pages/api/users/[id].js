import getScopeProjection from "@/shared/models/plugins/scopeProjection";
import User from "@/shared/models/User";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { getAuthScope, getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.head(async (req, res) => {
  const { id } = req.query;
  const scope = await getAuthScope(req, res);
  const projection = getScopeProjection(scope, User.schema);

  const user = await User.findById(id, projection).lean().exec();
  if (!user) throw { status: 404 };

  res.status(200).send();
});

handler.get(async (req, res) => {
  const { id } = req.query;
  const scope = await getAuthScope(req, res);
  const projection = getScopeProjection(scope, User.schema);

  const user = await User.findById(id, projection).lean().exec();
  if (!user) throw { status: 404, message: "Resource not found" };

  res.status(200).json(user);
});

handler.patch(async (req, res) => {
  const { query, body } = req;
  const { id } = query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id || authUser._id !== id) throw { status: 401, message: "Not authorized" };

  const user = await User.findById(id).exec();
  if (!user) throw { status: 404, message: "Resource not found" };

  for (const key in body) {
    if (!["name", "image"].includes(key)) continue;
    user[key] = body[key];
  }
  const updatedUser = await user.save();

  res.status(200).json(updatedUser.toJSON());
});

handler.delete(async (req, res) => {
  const { id } = req.query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id || !compareMongoIds(authUser._id, id)) throw { status: 401, message: "Not authorized" };

  await User.findByIdAndDelete(id);

  res.status(204).end();
});

export default handler;