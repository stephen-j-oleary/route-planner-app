"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

import { ApiGetVerifySendQuery } from "./schemas";
import { getUserById } from "@/app/api/user/actions";
import VerificationToken from "@/models/VerificationToken";
import { auth } from "@/utils/auth";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose";
import pages from "pages";


export async function getVerifySend({ resend = false }: ApiGetVerifySendQuery = {}) {
  const { userId } = await auth(cookies());
  if (!userId) throw new ApiError(401, "User required");

  await connectMongoose();

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");
  if (user.emailVerified) throw new Error("User already verified");

  const token = await VerificationToken.findOne({ identifier: user.email }).catch(() => null);
  if (token && !resend) throw new Error("Token already sent");

  revalidatePath(pages.api.userVerify);

  return await EmailVerifier().send(user, "verification");
}