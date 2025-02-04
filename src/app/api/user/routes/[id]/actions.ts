"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

import { ApiPatchUserRouteByIdData } from "./schemas";
import Route from "@/models/Route";
import pages from "@/pages";
import { auth } from "@/utils/auth";
import compareMongoIds from "@/utils/compareMongoIds";
import connectMongoose from "@/utils/connectMongoose";
import { fromMongoose } from "@/utils/mongoose";


export async function getUserRouteById(id: string) {
  const { userId } = await auth(cookies());

  await connectMongoose();

  const route = await Route.findById(id).lean().exec();
  if (!route) throw new ApiError(404, "Not found");

  if (!compareMongoIds(userId, route.userId)) throw new ApiError(403, "Forbidden");

  return fromMongoose(route);
}


export async function patchUserRouteById(id: string, data: ApiPatchUserRouteByIdData) {
  const { userId } = await auth(cookies());

  await connectMongoose();

  const route = await getUserRouteById(id);
  if (!route) throw new ApiError(404, "Not found");

  if (!compareMongoIds(userId, route.userId)) throw new ApiError(403, "Forbidden");

  const updatedRoute = await Route.findByIdAndUpdate(id, data).lean().exec();
  if (!updatedRoute) throw new ApiError(404, "Not found");

  revalidatePath(pages.api.userRoutes);

  return fromMongoose(updatedRoute);
}


export async function deleteUserRouteById(id: string) {
  const { userId } = await auth(cookies());

  await connectMongoose();

  const route = await getUserRouteById(id);
  if (!route) throw new ApiError(404, "Not found");

  if (!compareMongoIds(userId, route.userId)) throw new ApiError(403, "Forbidden");

  const deletedRoute = await Route.findByIdAndDelete(id).lean().exec();
  if (!deletedRoute) throw new ApiError(404, "Not found");

  revalidatePath(pages.api.userRoutes);

  return fromMongoose(deletedRoute);
}