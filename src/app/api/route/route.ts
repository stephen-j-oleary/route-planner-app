import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getRoute } from "./actions";
import { ApiGetRouteQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    const query = await ApiGetRouteQuerySchema
      .validate(
        Object.fromEntries(req.nextUrl.searchParams.entries()),
        { context: { isCustomer: !!customerId } },
      )
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getRoute(query)
    );
  }
);