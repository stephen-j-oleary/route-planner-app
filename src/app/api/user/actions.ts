"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ApiPatchUserBody } from "./schemas";
import User from "@/models/User";
import { auth } from "@/utils/auth";
import connectMongoose from "@/utils/connectMongoose";
import pages from "pages";


export async function getUserById(id: string) {
  await connectMongoose();

  return await User.findById(id).lean().exec();
}


export async function patchUser(data: ApiPatchUserBody) {
  const { userId } = await auth(cookies());
  if (!userId) throw new ApiError(401, "Not authorized");

  await connectMongoose();

  const user = await User.findByIdAndUpdate(userId, data).lean().exec();
  if (!user) throw new ApiError(404, "User not found");

  revalidatePath(pages.api.user);

  return NextResponse.json(user);
}


export async function deleteUser() {
  const { userId } = await auth(cookies());
  if (!userId) throw new ApiError(401, "Not authorized");

  await User.findByIdAndDelete(userId).lean().exec();

  revalidatePath(pages.api.user);

  return;
}