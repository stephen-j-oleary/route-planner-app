import { NextResponse } from "next/server";

import { deleteUserAccounts, getUserAccounts } from "./actions";
import { ApiDeleteUserAccountsQuerySchema, ApiGetUserAccountsQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetUserAccountsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getUserAccounts(query)
    );
  }
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiDeleteUserAccountsQuerySchema
      .validate(req.nextUrl.searchParams)
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    await deleteUserAccounts(query);

    return new NextResponse(null, { status: 204 });
  }
);