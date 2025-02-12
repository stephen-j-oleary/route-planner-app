"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";
import { InferType } from "yup";

import User from "@/models/User";
import { UserProfileSchema } from "@/models/User/schemas";
import pages from "@/pages";
import auth from "@/utils/auth";
import { handleSignIn } from "@/utils/auth/actions";
import connectMongoose from "@/utils/connectMongoose";
import { fromMongoose } from "@/utils/mongoose";


export async function getUserById(id: string | undefined) {
  if (!id) return null;

  const { user: { id: userId } = {} } = await auth(pages.api.user).api();
  if (!userId) throw new ApiError(401, "Not authorized");

  if (userId !== id) throw new ApiError(403, "Not authorized");

  await connectMongoose();

  return fromMongoose(
    await User.findById(id).lean().exec()
  );
}


export async function patchUser(data: InferType<typeof UserProfileSchema>) {
  const { user: { id: userId } = {} } = await auth(pages.api.user).api();
  if (!userId) throw new ApiError(401, "Not authorized");

  await connectMongoose();

  const updatedUser = await User.findByIdAndUpdate(userId, data).lean().exec();
  if (!updatedUser) throw new ApiError(404, "User not found");

  await handleSignIn();

  return fromMongoose(updatedUser);
}


export async function deleteUser() {
  const { user: { id: userId } = {} } = await auth(pages.api.user).api();
  if (!userId) throw new ApiError(401, "Not authorized");

  await User.findByIdAndDelete(userId).lean().exec();

  revalidatePath(pages.api.user);

  return;
}