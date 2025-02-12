"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";

import { ApiPostUserRouteData } from "./schemas";
import Route from "@/models/Route";
import pages from "@/pages";
import auth from "@/utils/auth";
import connectMongoose from "@/utils/connectMongoose";
import { checkFeature, features } from "@/utils/features";
import { fromMongoose } from "@/utils/mongoose";


export async function getUserRoutes() {
  const { user: { id: userId } = {} } = await auth(pages.api.userRoutes).api();
  if (!userId) throw new ApiError(403, "User not authorized");

  await connectMongoose();

  return fromMongoose(
    await Route.find({ userId }).lean().exec()
  );
}


export async function postUserRoute(data: ApiPostUserRouteData) {
  const { user: { id: userId } = {} } = await auth(pages.api.userRoutes).api();
  if (!userId) throw new ApiError(401, "Not authorized");
  if (!(await checkFeature(features.routes_save))) throw new ApiError(403, "Upgrade required");

  await connectMongoose();

  const newRoute = (await Route.create({ ...data, userId })).toJSON();

  revalidatePath(pages.api.userRoutes);

  return fromMongoose(newRoute);
}