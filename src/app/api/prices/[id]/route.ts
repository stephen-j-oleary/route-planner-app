import { NextResponse } from "next/server";

import { ApiGetPriceByIdQuerySchema, handleGetPriceById } from "./handlers";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { id } = params;
    const query = await ApiGetPriceByIdQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const data = await handleGetPriceById(id, query);
    if (!data) throw new ApiError(404, "Price not found");

    return NextResponse.json(data);
  }
);