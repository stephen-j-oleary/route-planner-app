import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getUserUpcomingInvoice, postUserUpcomingInvoice } from "./actions";
import { ApiGetUserUpcomingInvoiceQuerySchema, ApiPostUserUpcomingInvoiceBodySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(404, "Invoice not found");

    const query = await ApiGetUserUpcomingInvoiceQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getUserUpcomingInvoice({ ...query, customer: customerId })
    );
  }
);


export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    const body = await ApiPostUserUpcomingInvoiceBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await postUserUpcomingInvoice(body)
    );
  }
);