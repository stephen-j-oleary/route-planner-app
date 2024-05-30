import { NextResponse } from "next/server";

import { ApiGetAccountsQuerySchema, handleGetAccounts } from "./handlers";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetAccountsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const accounts = await handleGetAccounts(query);

    return NextResponse.json(accounts);
  }
);