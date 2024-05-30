import { NextResponse } from "next/server";

import { ApiGetProductsQuerySchema, handleGetProducts } from "./handlers";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetProductsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const data = await handleGetProducts(query);

    return NextResponse.json(data);
  }
);