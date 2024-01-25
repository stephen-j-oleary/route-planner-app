import { array, date, InferType, number, object, string, tuple } from "yup";

import Route from "@/models/Route";
import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import validation from "@/nextConnect/middleware/validation";
import { NotFoundError } from "@/utils/ApiErrors";


const handler = nextConnect();

handler.use(mongooseMiddleware);

export type ApiGetRoutesResponse = Awaited<ReturnType<typeof handleGetRoutes>>;

export async function handleGetRoutes(params: { userId: string }) {
  return await Route.find(params).lean({ virtuals: true }).exec();
}

handler.get(
  // TODO: Fix authorization locals types
  authorization({ isUser: true }),
  async (_req, res) => {
    // Get the routes by owner
    const routes = await handleGetRoutes({
      userId: res.locals.userId!, // Filter by authorized user
    });
    if (!routes) throw new NotFoundError();

    res.status(200).json(routes);
  }
);

export const ApiPostRouteBodySchema = object({
  _id: string().optional(),
  editUrl: string().required(),
  distance: number().required().min(0),
  duration: number().required().min(0),
  stops: array(
    object({
      fullText: string().required(),
      mainText: string().optional(),
      coordinates: tuple([number().required(), number().required()]).required(),
      duration: number().required(),
    })
  ).required().min(2),
  legs: array(
    object({
      distance: number().required(),
      duration: number().required(),
      polyline: string().required(),
    })
  ).required().min(1),
  createdAt: date().optional(),
});
export type ApiPostRouteData = InferType<typeof ApiPostRouteBodySchema>;
export type ApiPostRouteResponse = Awaited<ReturnType<typeof handleCreateRoute>>;

export async function handleCreateRoute(data: ApiPostRouteData & { userId: string }) {
  return (await Route.create(data)).toJSON();
}

handler.post(
  authorization({ isSubscriber: true }),
  validation({ body: ApiPostRouteBodySchema }),
  async (req, res) => {
    // Create the route
    const route = await handleCreateRoute({
      ...req.body,
      userId: res.locals.userId,
    });

    res.status(201).json(route);
  }
);


export default handler;