import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserSubscriptions } from "./actions";
import { ApiGetUserSubscriptionsQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");
    if (!customerId) throw new ApiError(403, "User not authorized");

    const query = await ApiGetUserSubscriptionsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getUserSubscriptions({ ...query, customer: customerId })
    );
  }
);