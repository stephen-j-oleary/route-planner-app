import { array, date, InferType, number, object, string, tuple } from "yup";

import Route from "@/models/Route";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";


const handler = nextConnect();


export type ApiGetUserRoutesResponse = Awaited<ReturnType<typeof handleGetUserRoutes>>;

export async function handleGetUserRoutes(params: { userId: string }) {
  return await Route.find(params).lean().exec();
}

handler.get(
  authorization({ isUser: true }),
  async (req, res) => {
    const { userId } = req.locals.authorized as AuthorizedType;

    const routes = await handleGetUserRoutes({ userId: userId! });

    res.status(200).json(routes satisfies NonNullable<ApiGetUserRoutesResponse>);
  }
);


const ApiPostUserRouteSchema = object({
  body: object({
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
  }),
});
export type ApiPostUserRouteData = InferType<typeof ApiPostUserRouteSchema>["body"];
export type ApiPostUserRouteResponse = Awaited<ReturnType<typeof handlePostUserRoute>>;

export async function handlePostUserRoute(data: ApiPostUserRouteData & { userId: string }) {
  return (await Route.create(data)).toJSON();
}

handler.post(
  authorization({ isSubscriber: true }),
  validation(ApiPostUserRouteSchema),
  async (req, res) => {
    const { body } = req.locals.validated as ValidatedType<typeof ApiPostUserRouteSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;

    const route = await handlePostUserRoute({ ...body, userId: userId! });

    res.status(201).json(route satisfies NonNullable<ApiPostUserRouteResponse>);
  }
);


export default handler;