import { NextResponse } from "next/server";

import { getRoute } from "./actions";
import { ApiGetRouteQuerySchema } from "./schemas";
import pages from "@/pages";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";
import { checkFeature, features } from "@/utils/features";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    await auth(pages.api.route).api();

    const [basicRoute, plusRoute, premiumRoute] = await Promise.all([
      checkFeature(features.routes_basic),
      checkFeature(features.routes_plus),
      checkFeature(features.routes_premium),
    ]);

    if (!basicRoute && !plusRoute && !premiumRoute) throw new ApiError(401, "Not authorized");

    const maxStops = premiumRoute
      ? 100
      : plusRoute
      ? 30
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