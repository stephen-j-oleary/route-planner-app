import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserRoutes, postUserRoute } from "./actions";
import { ApiPostUserRouteBodySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import { features, hasFeatureAccess } from "@/utils/features";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    return NextResponse.json(
      await getUserRoutes({ userId })
    );
  }
);


export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!(await hasFeatureAccess(features.routes_save, cookies()))) throw new ApiError(403, "Forbidden");

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