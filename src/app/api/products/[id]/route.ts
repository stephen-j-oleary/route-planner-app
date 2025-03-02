import { NextResponse } from "next/server";

import { getProductById } from "./actions";
import { AppRouteHandler } from "@/types/next";
import { apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { id } = await params;

    return NextResponse.json(
      await getProductById(id)
    );
  }
);