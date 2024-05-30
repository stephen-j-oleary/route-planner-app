import { NextResponse } from "next/server";

import { handleGetProductById } from "./handlers";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { id } = params;

    const product = await handleGetProductById(id);
    if (!product) throw new ApiError(404, "Product not found");

    return NextResponse.json(product);
  }
);