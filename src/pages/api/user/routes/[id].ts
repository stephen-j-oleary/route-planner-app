import { array, InferType, number, object, string, tuple } from "yup";

import Route from "@/models/Route";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();


export const ApiGetUserRouteByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiGetUserRouteByIdResponse = Awaited<ReturnType<typeof handleGetUserRouteById>>;

export async function handleGetUserRouteById(id: string) {
  return await Route.findById(id).lean().exec();
}

handler.get(
  authorization({ isSubscriber: true }),
  validation(ApiGetUserRouteByIdSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserRouteByIdSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the route
    const route = await handleGetUserRouteById(id);
    if (!route) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, route.userId)) throw new ForbiddenError();

    res.status(200).json(route satisfies NonNullable<ApiGetUserRouteByIdResponse>);
  }
);


export const ApiPatchUserRouteByIdSchema = object({
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
export type ApiPatchUserRouteByIdData = InferType<typeof ApiPatchUserRouteByIdSchema>["body"];
export type ApiPatchUserRouteByIdResponse = Awaited<ReturnType<typeof handlePatchUserRouteById>>;

export async function handlePatchUserRouteById(id: string, data: ApiPatchUserRouteByIdData) {
  return await Route.findByIdAndUpdate(id, data).lean().exec();
}

handler.patch(
  authorization({ isSubscriber: true }),
  validation(ApiPatchUserRouteByIdSchema),
  async (req, res) => {
    const { query, body } = req.locals.validated as ValidatedType<typeof ApiPatchUserRouteByIdSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the route to check owner
    const route = await handleGetUserRouteById(id);
    if (!route) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, route.userId)) throw new ForbiddenError();

    // Update the route
    const updatedRoute = await handlePatchUserRouteById(id, body);
    if (!updatedRoute) throw new NotFoundError();

    res.status(200).json(updatedRoute satisfies NonNullable<ApiPatchUserRouteByIdResponse>);
  }
);


export const ApiDeleteUserRouteByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiDeleteUserRouteByIdResponse = Awaited<ReturnType<typeof handleDeleteUserRouteById>>;

export async function handleDeleteUserRouteById(id: string) {
  return await Route.findByIdAndDelete(id).lean().exec();
}

handler.delete(
  authorization({ isSubscriber: true }),
  validation(ApiDeleteUserRouteByIdSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiDeleteUserRouteByIdSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the route to check the owner
    const route = await handleGetUserRouteById(id);
    if (!route) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, route.userId)) throw new ForbiddenError();

    // Delete the route
    const deletedRoute = await handleDeleteUserRouteById(id);
    if (!deletedRoute) throw new NotFoundError();

    res.status(204).end();
  }
);


export default handler;