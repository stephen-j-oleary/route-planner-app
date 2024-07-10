import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteUserAccounts, getUserAccounts } from "./actions";
import { ApiDeleteUserAccountsQuerySchema, ApiGetUserAccountsQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetUserAccountsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const session = await auth(cookies());
    const { userId } = session;
    if (!userId) throw new ApiError(401, "User required");

    const accounts = await getUserAccounts({ ...query, userId });

    return NextResponse.json(accounts);
  }
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiDeleteUserAccountsQuerySchema
      .validate(req.nextUrl.searchParams)
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const session = await auth(cookies());
    const { userId } = session;
    if (!userId) throw new ApiError(401, "User required");

    await deleteUserAccounts({ ...query, userId });

    return new NextResponse(null, { status: 204 });
  }
);