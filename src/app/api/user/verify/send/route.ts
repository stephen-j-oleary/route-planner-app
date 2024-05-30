import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { boolean, InferType, object } from "yup";

import { handleGetUserById } from "@/app/api/user/route";
import VerificationToken from "@/models/VerificationToken";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose";


export const ApiGetVerifySendQuerySchema = object()
  .shape({
    resend: boolean().optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetVerifySendQuery = InferType<typeof ApiGetVerifySendQuerySchema>;

export async function handleGetVerifySend(userId: string, { resend = false }: ApiGetVerifySendQuery = {}) {
  await connectMongoose();

  const user = await handleGetUserById(userId);
  if (!user) throw new Error("User not found");
  if (user.emailVerified) throw new Error("User already verified");

  const token = await VerificationToken.findOne({ identifier: user.email }).catch(() => null);
  if (token && !resend) throw new Error("Token already sent");

  return await EmailVerifier().send(user, "verification");
}

export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");

    const query = await ApiGetVerifySendQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    await handleGetVerifySend(userId, query);

    return new NextResponse(null, { status: 204 });
  }
);