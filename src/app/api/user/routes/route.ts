import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserRoutes, postUserRoute } from "./actions";
import { ApiPostUserRouteBodySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(403, "Forbidden");

    return NextResponse.json(
      await getUserRoutes({ userId })
    );
  }
);


export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(403, "Forbidden");

    const body = await ApiPostUserRouteBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await postUserRoute({ ...body, userId })
    );
  }
);