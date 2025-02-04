import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserInvoices } from "./actions";
import { ApiGetUserInvoicesQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { user: { id: userId } = {} } = await auth(cookies()).api();
    if (!userId) throw new ApiError(401, "Not authorized");

    const query = await ApiGetUserInvoicesQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getUserInvoices(query)
    );
  }
);