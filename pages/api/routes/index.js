import { isUndefined, omitBy } from "lodash";

import Route from "@/shared/models/Route";
import nextConnect from "@/shared/nextConnect";
import mongooseMiddleware from "@/shared/nextConnect/middleware/mongoose";
import { AuthError, NotFoundError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import compareMongoIds from "@/shared/utils/compareMongoIds";



const handler = nextConnect();

handler.use(mongooseMiddleware);

handler.get(async (req, res) => {
  const filter = createRouteFilter(req);

  const authUser = await getAuthUser(req, res);
  if (!authUser?.id) throw new AuthError();

  let routes = await Route.find(filter).lean({ virtuals: true }).exec();
  if (!routes) throw new NotFoundError();
  routes = routes.filter(r => compareMongoIds(authUser.id, r.userId));

  res.status(200).json(routes);
});

handler.post(async (req, res) => {
  const { body } = req;

  const route = await Route.create(body);

  res.status(201).json(route.toJSON());
});


export default handler;


function createRouteFilter({ query }) {
  return omitBy({
    userId: query.userId,
  }, isUndefined);
}