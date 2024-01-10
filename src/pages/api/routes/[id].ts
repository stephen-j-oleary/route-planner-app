import { object, string, ValidationError } from "yup";

import Route from "@/models/Route";
import nextConnect from "@/nextConnect";
import authMiddleware from "@/nextConnect/middleware/auth";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import { AuthError, ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);

export const ApiGetRouteByIdQuerySchema = object({
  id: string().required(),
});
export type ApiGetRouteByIdResponse = Awaited<ReturnType<typeof handleGetRouteById>>;

export async function handleGetRouteById(id: string) {
  return await Route.findById(id).lean({ virtuals: true }).exec();
}

handler.get(
  authMiddleware({ requireAccount: true, requireSubscription: false }),
  async (req, res) => {
    const { id } = await ApiGetRouteByIdQuerySchema
      .validate(req.query, { stripUnknown: true })
      .catch(err => {
        if (err instanceof ValidationError) throw new RequestError(`Invalid param: ${err.path}`);
        throw new RequestError("Invalid request");
      });

    const route = await handleGetRouteById(id);
    if (!route) throw new NotFoundError();

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser?.id, route.userId)) throw new ForbiddenError();

    res.status(200).json(route);
  }
);

handler.patch(async (req, res) => {
  const { query, body } = req;
  const { id } = query;

  const authUser = await getAuthUser(req, res);
  if (!authUser?.id) throw new AuthError();

  const route = await Route.findById(id).exec();
  if (!route) throw new NotFoundError();
  if (!compareMongoIds(authUser.id, route.userId)) throw new ForbiddenError();

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
  if (!authUser?.id) throw new AuthError();

  const route = await Route.findById(id).lean().exec();
  if (!route) throw new NotFoundError();
  if (!compareMongoIds(authUser.id, route.userId)) throw new ForbiddenError();

  await Route.findByIdAndDelete(id);

  res.status(204).end();
});


export default handler;