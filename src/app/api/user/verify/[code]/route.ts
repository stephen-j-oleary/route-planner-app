import { NextResponse } from "next/server";

import { getVerifyUser } from "./actions";
import { AppRouteHandler } from "@/types/next";
import { apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler<{ code: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { code } = params;

    await getVerifyUser(code);

    return new NextResponse(null, { status: 204 });
  }
);