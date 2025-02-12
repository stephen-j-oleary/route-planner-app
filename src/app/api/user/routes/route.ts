import { NextResponse } from "next/server";

import { getUserRoutes, postUserRoute } from "./actions";
import { ApiPostUserRouteBodySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => NextResponse.json(
    await getUserRoutes()
  )
);


export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const body = await ApiPostUserRouteBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await postUserRoute(body)
    );
  }
);