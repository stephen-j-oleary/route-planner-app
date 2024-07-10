import { NextResponse } from "next/server";

import { getVerifySend } from "./actions";
import { ApiGetVerifySendQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetVerifySendQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    await getVerifySend(query);

    return new NextResponse(null, { status: 204 });
  }
);