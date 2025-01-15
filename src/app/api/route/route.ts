import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getRoute } from "./actions";
import { ApiGetRouteQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import { features, hasFeatureAccess } from "@/utils/features";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    const [basicRoute, premiumRoute] = await Promise.all([
      hasFeatureAccess(features.routes_basic, cookies()),
      hasFeatureAccess(features.routes_premium, cookies()),
    ]);

    if (!basicRoute && !premiumRoute) throw new ApiError(401, "Not authorized");

    const maxStops = premiumRoute
      ? 100
      : basicRoute
      ? 10
      : 0;

    const query = await ApiGetRouteQuerySchema
      .validate(
        Object.fromEntries(req.nextUrl.searchParams.entries()),
        { context: { maxStops } },
      )
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getRoute(query)
    );
  }
);