import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { array, InferType, number, object, string, tuple } from "yup";

import Route from "@/models/Route";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth/server";
import compareMongoIds from "@/utils/compareMongoIds";
import connectMongoose from "@/utils/connectMongoose";
import pages from "pages";


export type ApiGetUserRouteByIdResponse = Awaited<ReturnType<typeof handleGetUserRouteById>>;

export async function handleGetUserRouteById(id: string) {
  await connectMongoose();

  return await Route.findById(id).lean().exec();
}

export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(403, "Forbidden");

    const { id } = params;

    const route = await handleGetUserRouteById(id);
    if (!route) throw new ApiError(404, "Not found");

    if (!compareMongoIds(userId, route.userId)) throw new ApiError(403, "Forbidden");

    return NextResponse.json(route);
  }
);


export const ApiPatchUserRouteByIdBodySchema = object()
  .shape({
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
  })
  .required()
  .noUnknown();
export type ApiPatchUserRouteByIdData = InferType<typeof ApiPatchUserRouteByIdBodySchema>;
export type ApiPatchUserRouteByIdResponse = Awaited<ReturnType<typeof handlePatchUserRouteById>>;

export async function handlePatchUserRouteById(id: string, data: ApiPatchUserRouteByIdData) {
  await connectMongoose();

  const res = await Route.findByIdAndUpdate(id, data).lean().exec();

  revalidatePath(pages.api.userRoutes);

  return res;
}

export const PATCH: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(403, "Forbidden");

    const { id } = params;

    const body = await ApiPatchUserRouteByIdBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const route = await handleGetUserRouteById(id);
    if (!route) throw new ApiError(404, "Not found");

    if (!compareMongoIds(userId, route.userId)) throw new ApiError(403, "Forbidden");

    const updatedRoute = await handlePatchUserRouteById(id, body);
    if (!updatedRoute) throw new ApiError(404, "Not found");

    return NextResponse.json(updatedRoute);
  }
);


export type ApiDeleteUserRouteByIdResponse = Awaited<ReturnType<typeof handleDeleteUserRouteById>>;

export async function handleDeleteUserRouteById(id: string) {
  await connectMongoose();

  const res = await Route.findByIdAndDelete(id).lean().exec();

  revalidatePath(pages.api.userRoutes);

  return res;
}

export const DELETE: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(403, "Forbidden");

    const { id } = params;

    const route = await handleGetUserRouteById(id);
    if (!route) throw new ApiError(404, "Not found");

    // Check owner
    if (!compareMongoIds(userId, route.userId)) throw new ApiError(403, "Forbidden");

    // Delete the route
    const deletedRoute = await handleDeleteUserRouteById(id);
    if (!deletedRoute) throw new ApiError(404, "Not found");

    return new NextResponse(null, { status: 204 });
  }
);