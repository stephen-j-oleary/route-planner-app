import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import stripeClientNext from "@/utils/stripeClient/next";


export type ApiGetUserCustomerResponse = Awaited<ReturnType<typeof handleGetUserCustomer>>;

export async function handleGetUserCustomer(id: string) {
  return await stripeClientNext.customers.retrieve(id);
}

export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    const { customerId } = await auth(cookies());
    if (!customerId) throw new ApiError(404, "Not found");

    const data = await handleGetUserCustomer(customerId);
    if (!data) throw new ApiError(404, "Not found");

    return NextResponse.json(data);
  }
);


export type ApiDeleteUserCustomerRepsonse = Awaited<ReturnType<typeof handleDeleteUserCustomer>>;

export async function handleDeleteUserCustomer(id: string) {
  const { deleted } = await stripeClientNext.customers.del(id);
  return { deletedCount: +deleted };
}

export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    const { customerId } = await auth(cookies());
    if (!customerId) throw new ApiError(404, "Not found");

    const data = await handleDeleteUserCustomer(customerId);
    if (!data.deletedCount) throw new ApiError(404, "Not found");

    return new NextResponse(null, { status: 204 });
  }
);