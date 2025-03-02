import { NextResponse } from "next/server";

import { handleGetConsentRecord } from "./actions";
import { AppRouteHandler } from "@/types/next";
import { apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => NextResponse.json(
    await handleGetConsentRecord()
  )
);