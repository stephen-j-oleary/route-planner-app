import { NextResponse } from "next/server";

import { getAccounts } from "./actions";
import { ApiGetAccountsQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetAccountsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getAccounts(query)
    );
  }
);