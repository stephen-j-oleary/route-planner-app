import { array, InferType, number, object, string, tuple } from "yup";

import Route from "@/models/Route";
import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import mongooseMiddleware from "@/nextConnect/middleware/mongoose";
import validation from "@/nextConnect/middleware/validation";
import { ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();

handler.use(mongooseMiddleware);

export const ApiGetRouteByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiGetRouteByIdResponse = Awaited<ReturnType<typeof handleGetRouteById>>;

export async function handleGetRouteById(id: string) {
  return await Route.findById(id).lean({ virtuals: true }).exec();
}

handler.get(
  authorization({ isUser: true }),
  validation(ApiGetRouteByIdSchema),
  async (req, res) => {
    // Get the route
    const route = await handleGetRouteById(req.query.id);
    if (!route) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(res.locals.userId, route.userId)) throw new ForbiddenError();

    res.status(200).json(route);
  }
);


export const ApiPatchRouteSchema = object({
  query: object({
    id: string().required(),
  }),
  body: object({
    editUrl: string().optional(),
    distance: number().optional().min(0),
    duration: number().optional().min(0),
    stops: array(
      object({
        fullText: string().required(),
        mainText: string().optional(),
        coordinates: tuple([number().required(), number().required()]).required(),
        duration: number().required(),
      })
    ).optional().min(2),
    legs: array(
      object({
        distance: number().required(),
        duration: number().required(),
        polyline: string().required(),
      })
    ).optional().min(1),
  }),
});
export type ApiPatchRouteData = InferType<typeof ApiPatchRouteSchema>["body"];
export type ApiPatchRouteResponse = Awaited<ReturnType<typeof handlePatchRouteById>>;

export async function handlePatchRouteById(id: string, data: ApiPatchRouteData) {
  return await Route.findByIdAndUpdate(id, data).lean({ virtuals: true }).exec();
}

handler.patch(
  authorization({ isUser: true }),
  validation(ApiPatchRouteSchema),
  async (req, res) => {
    const { id } = req.query;

    // Get the route to check owner
    const route = await handleGetRouteById(id);
    if (!route) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(res.locals.userId, route.userId)) throw new ForbiddenError();

    // Update the route
    const updatedRoute = await handlePatchRouteById(id, req.body);
    if (!updatedRoute) throw new NotFoundError();

    res.status(200).json(updatedRoute);
  }
);


export const ApiDeleteRouteSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiDeleteRouteResponse = Awaited<ReturnType<typeof handleDeleteRoute>>;

export async function handleDeleteRoute(id: string) {
  return await Route.findByIdAndDelete(id).lean({ virtuals: true }).exec();
}

handler.delete(
  authorization({ isUser: true }),
  validation(ApiDeleteRouteSchema),
  async (req, res) => {
    const { id } = req.query;

    // Get the route to check the owner
    const route = await handleGetRouteById(id);
    if (!route) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(res.locals.userId, route.userId)) throw new ForbiddenError();

    // Delete the route
    const deletedRoute = await handleDeleteRoute(id);
    if (!deletedRoute) throw new NotFoundError();

    res.status(204).end();
  }
);


export default handler;