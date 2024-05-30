import { NextResponse } from "next/server";

import { ApiGetPricesQuerySchema, handleGetPrices } from "./handlers";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetPricesQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const data = await handleGetPrices(query);
    if (!data) throw new ApiError(404, "Prices not found");

    return NextResponse.json(data);
  }
);