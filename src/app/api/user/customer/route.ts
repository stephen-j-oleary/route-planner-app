import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteUserCustomer, getUserCustomer } from "./actions";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    return NextResponse.json(
      await getUserCustomer()
    );
  }
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    const { customer: { id: customerId } = {} } = await auth(cookies()).api();
    if (!customerId) throw new ApiError(404, "Not found");

    await deleteUserCustomer(customerId);

    return new NextResponse(null, { status: 204 });
  }
);