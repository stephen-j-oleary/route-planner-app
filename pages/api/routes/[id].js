import Route from "@/shared/models/Route";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.head(async (req, res) => {
  const { id } = req.query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401 };

  const route = await Route.findById(id).lean({ virtuals: true }).exec();
  if (!route) throw { status: 404 };
  if (!compareMongoIds(authUser._id, route.userId)) throw { status: 401 };

  res.status(200).send();
});

handler.get(async (req, res) => {
  const { id } = req.query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401, message: "Not authorized" };

  const route = await Route.findById(id).lean({ virtuals: true }).exec();
  if (!route) throw { status: 404, message: "Resource not found" };
  if (!compareMongoIds(authUser._id, route.userId)) throw { status: 401, message: "Not authorized" };

  res.status(200).json(route);
});

handler.patch(async (req, res) => {
  const { query, body } = req;
  const { id } = query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401, message: "Not authorized" };

  const route = await Route.findById(id).exec();
  if (!route) throw { status: 404, message: "Resource not found" };
  if (!compareMongoIds(authUser._id, route.userId)) throw { status: 401, message: "Not authorized" };

  for (const key in body) {
    if (!["encodedRoute"].includes(key)) continue;
    route[key] = body[key];
  }
  const updatedRoute = await route.save();

  res.status(200).json(updatedRoute.toJSON());
});

handler.delete(async (req, res) => {
  const { id } = req.query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?._id) throw { status: 401, message: "Not authorized" };

  const route = await Route.findById(id).lean().exec();
  if (!route) throw { status: 404, message: "Resource not found" };
  if (!compareMongoIds(authUser._id, route.userId)) throw { status: 401, message: "Not authorized" };

  await Route.findByIdAndDelete(id);

  res.status(204).send();
});


export default handler;