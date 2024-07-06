import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { array, date, InferType, number, object, string, tuple } from "yup";

import Route from "@/models/Route";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth/server";
import connectMongoose from "@/utils/connectMongoose";
import pages from "pages";


export type ApiGetUserRoutesResponse = Awaited<ReturnType<typeof handleGetUserRoutes>>;

export async function handleGetUserRoutes(params: { userId: string }) {
  await connectMongoose();

  return await Route.find(params).lean().exec();
}

export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(403, "Forbidden");

    const routes = await handleGetUserRoutes({ userId });

    return NextResponse.json(routes);
  }
);


const ApiPostUserRouteBodySchema = object()
  .shape({
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
  })
  .required()
  .noUnknown();
export type ApiPostUserRouteData = InferType<typeof ApiPostUserRouteBodySchema>;
export type ApiPostUserRouteResponse = Awaited<ReturnType<typeof handlePostUserRoute>>;

export async function handlePostUserRoute(data: ApiPostUserRouteData & { userId: string }) {
  await connectMongoose();

  const res = (await Route.create(data)).toJSON();

  revalidatePath(pages.api.userRoutes);

  return res;
}

export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(403, "Forbidden");

    const body = await ApiPostUserRouteBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const route = await handlePostUserRoute({ ...body, userId });

    return NextResponse.json(route);
  }
);