import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { handleGetUserById } from "@/app/api/user/route";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import { auth, updateAuth } from "@/utils/auth/server";
import pages from "pages";


export type ApiGetVerifyUserResponse = Awaited<ReturnType<typeof handleGetVerifyUser>>;

export async function handleGetVerifyUser(userId: string, code: string) {
  const user = await handleGetUserById(userId);
  if (!user) return false;
  if (user.emailVerified) throw new ApiError(400, "User already verified");
  if (!code) return false;

  const ok = await EmailVerifier().verify(user, code);
  if (!ok) throw new ApiError(500, "Verification failed");

  await updateAuth({ ...user, emailVerified: new Date() }, cookies());

  revalidatePath(pages.api.user);
  revalidatePath(pages.api.session);

  return;
}

export const GET: AppRouteHandler<{ code: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");

    const { code } = params;

    await handleGetVerifyUser(userId, code);

    return new NextResponse(null, { status: 204 });
  }
);