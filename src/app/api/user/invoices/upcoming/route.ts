import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { array, boolean, date, InferType, number, object, string } from "yup";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth/server";
import stripeClientNext from "@/utils/stripeClient/next";


const ApiGetUserUpcomingInvoiceQuerySchema = object()
  .shape({
    subscription: string().optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserUpcomingInvoiceQuery = InferType<typeof ApiGetUserUpcomingInvoiceQuerySchema>;
export type ApiGetUserUpcomingInvoiceResponse = Awaited<ReturnType<typeof handleGetUserUpcomingInvoice>>;

export async function handleGetUserUpcomingInvoice(query: ApiGetUserUpcomingInvoiceQuery & { customer: string }) {
  return await stripeClientNext.invoices.retrieveUpcoming(query);
}

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

    const data = await handleGetUserUpcomingInvoice({ ...query, customer: customerId });
    if (!data) throw new ApiError(404, "Invoice not found");

    return NextResponse.json(data);
  }
);


const ApiPostUserUpcomingInvoiceBodySchema = object()
  .shape({
    expand: array(string().required()).optional(),
    subscription: string().optional(),
    subscription_cancel_at: date().optional(),
    subscription_proration_date: date().optional(),
    subscription_cancel_at_period_end: boolean().optional(),
    subscription_cancel_now: boolean().optional(),
    subscription_items: array(object({
      id: string().optional(),
      deleted: boolean().optional(),
      plan: string().optional(),
      price: string().optional(),
      quantity: number().optional(),
    })).optional(),
  })
  .optional()
  .noUnknown();
export type ApiPostUserUpcomingInvoiceBody = InferType<typeof ApiPostUserUpcomingInvoiceBodySchema>;
export type ApiPostUserUpcomingInvoiceResponse = Awaited<ReturnType<typeof handlePostUserUpcomingInvoice>>;

export async function handlePostUserUpcomingInvoice({ subscription_cancel_at, subscription_proration_date, ...params }: ApiPostUserUpcomingInvoiceBody & { customer: string }) {
  return await stripeClientNext.invoices.retrieveUpcoming({
    subscription_cancel_at: subscription_cancel_at && subscription_cancel_at.valueOf() / 1000,
    subscription_proration_date: subscription_proration_date && subscription_proration_date.valueOf() / 1000,
    ...params,
  });
}

export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");
    if (!customerId) throw new ApiError(403, "Not authorized");

    const body = await ApiPostUserUpcomingInvoiceBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const data = await handlePostUserUpcomingInvoice({ ...body, customer: customerId });
    if (!data) throw new ApiError(500, "Resource not created");

    return NextResponse.json(data);
  }
);