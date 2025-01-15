import { NextResponse } from "next/server";

import { getPriceById } from "../actions";
import { ApiGetPriceByIdQuerySchema } from "../schemas";
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

    return NextResponse.json(
      await getPriceById(id, query)
    );
  }
);