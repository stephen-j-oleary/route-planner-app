import { NextResponse } from "next/server";

import { getProducts } from "./actions";
import { ApiGetProductsQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetProductsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getProducts(query)
    );
  }
);