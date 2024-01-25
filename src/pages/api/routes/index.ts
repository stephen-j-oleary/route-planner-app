import { InferType, object, string, ValidationError } from "yup";

import Route from "@/models/Route";
import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import { ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";



const handler = nextConnect();

handler.use(mongooseMiddleware);

export const ApiGetRoutesQuerySchema = object({
  userId: string().optional(),
})
export type ApiGetRoutesQuery = InferType<typeof ApiGetRoutesQuerySchema>
export type ApiGetRoutesResponse = Awaited<ReturnType<typeof handleGetRoutes>>

export async function handleGetRoutes(params: ApiGetRoutesQuery = {}) {
  return await Route.find(params).lean({ virtuals: true }).exec();
}

handler.get(
  // TODO: Fix authorization locals types
  authorization({ isUser: true }),
  async (req, res) => {
    const query = await ApiGetRoutesQuerySchema
      .validate(req.query, { stripUnknown: true })
      .catch(err => {
        if (err instanceof ValidationError) throw new RequestError(`Invalid param: ${err.path}`);
        throw new RequestError("Invalid request");
      });

    const authUser = await getAuthUser(req, res);
    if (query.userId && query.userId !== authUser?.id) throw new ForbiddenError();

    const routes = await handleGetRoutes({
      ...query,
      userId: authUser?.id,
    });
    if (!routes) throw new NotFoundError();

    res.status(200).json(routes);
  }
);

handler.post(
  authorization({ isSubscriber: true }),
  async (req, res) => {
    const { body } = req;

    const route = await Route.create(body);
  
    res.status(201).json(route.toJSON());
  }
);


export default handler;