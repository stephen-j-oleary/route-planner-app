"use server";

import { revalidatePath } from "next/cache";

import { ApiPostUserRouteData } from "./schemas";
import Route from "@/models/Route";
import pages from "@/pages";
import connectMongoose from "@/utils/connectMongoose";
import { fromMongoose } from "@/utils/mongoose";


export async function getUserRoutes({ userId }: { userId: string | undefined }) {
  if (!userId) return [];

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