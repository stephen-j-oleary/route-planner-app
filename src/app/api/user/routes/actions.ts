"use server";

import { revalidatePath } from "next/cache";

import { ApiPostUserRouteData } from "./schemas";
import Route from "@/models/Route";
import connectMongoose from "@/utils/connectMongoose";
import pages from "pages";


export async function getUserRoutes(params: { userId: string }) {
  await connectMongoose();

  return await Route.find(params).lean().exec();
}


export async function postUserRoute(data: ApiPostUserRouteData & { userId: string }) {
  await connectMongoose();

  const res = (await Route.create(data)).toJSON();

  revalidatePath(pages.api.userRoutes);

  return res;
}