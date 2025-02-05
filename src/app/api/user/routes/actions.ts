"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

import { ApiPostUserRouteData } from "./schemas";
import Route from "@/models/Route";
import pages from "@/pages";
import auth from "@/utils/auth";
import connectMongoose from "@/utils/connectMongoose";
import { fromMongoose } from "@/utils/mongoose";


export async function getUserRoutes() {
  const { user: { id: userId } = {} } = await auth(cookies()).api();
  if (!userId) throw new ApiError(403, "User not authorized");

  await connectMongoose();

  return fromMongoose(
    await Route.find({ userId }).lean().exec()
  );
}


export async function postUserRoute(data: ApiPostUserRouteData & { userId: string }) {
  await connectMongoose();

  const newRoute = (await Route.create(data)).toJSON();

  revalidatePath(pages.api.userRoutes);

  return fromMongoose(newRoute);
}