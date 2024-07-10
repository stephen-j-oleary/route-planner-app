import { NextResponse } from "next/server";

import { AppRouteHandler } from "@/types/next";
import { apiErrorHandler } from "@/utils/apiError";
import { signIn } from "@/utils/auth";


export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => NextResponse.json(
    await signIn(await req.json())
  )
);