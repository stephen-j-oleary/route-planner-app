import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteUserCustomer, getUserCustomer } from "./actions";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    const { customerId } = await auth(cookies());
    if (!customerId) throw new ApiError(404, "Not found");

    return NextResponse.json(
      await getUserCustomer(customerId)
    );
  }
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    const { customerId } = await auth(cookies());
    if (!customerId) throw new ApiError(404, "Not found");

    await deleteUserCustomer(customerId);

    return new NextResponse(null, { status: 204 });
  }
);