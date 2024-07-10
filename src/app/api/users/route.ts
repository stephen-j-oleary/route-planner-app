import { NextResponse } from "next/server";

import { getUsers } from "./actions";
import { ApiGetUsersQuerySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetUsersQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err);
      });

    return NextResponse.json(
      await getUsers(query)
    );
  }
);