"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

import { getUserById } from "@/app/api/user/actions";
import { auth, updateAuth } from "@/utils/auth";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import pages from "pages";


export async function getVerifyUser(code: string) {
  if (!code) throw new ApiError(400, "Incorrect or expired code");

  const { userId } = await auth(cookies());
  if (!userId) throw new ApiError(401, "User required");

  const user = await getUserById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.emailVerified) throw new ApiError(400, "User already verified");

  const ok = await EmailVerifier().verify(user, code);
  if (!ok) throw new ApiError(400, "Incorrect or expired code");

  await updateAuth({ ...user, emailVerified: new Date() }, cookies());

  revalidatePath(pages.api.user);
  revalidatePath(pages.api.session);

  return;
}