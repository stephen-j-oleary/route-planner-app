import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { array, date, InferType, object, string } from "yup";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import stripeClientNext from "@/utils/stripeClient/next";


const ApiGetUserInvoicesQuerySchema = object()
  .shape({
    due_date: date().optional(),
    expand: array(string().required()).optional(),
    status: string().oneOf(["draft", "open", "paid", "uncollectible", "void"]).optional(),
    subscription: string().optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserInvoicesQuery = InferType<typeof ApiGetUserInvoicesQuerySchema>;
export type ApiGetUserInvoicesResponse = Awaited<ReturnType<typeof handleGetUserInvoices>>;

export async function handleGetUserInvoices({ customer, due_date, ...query }: ApiGetUserInvoicesQuery & { customer?: string }) {
  if (!customer) return [];

  const { data } = await stripeClientNext.invoices.list({
    customer,
    due_date: due_date && due_date.valueOf() / 1000,
    ...query,
  });
  return data;
}

export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    const query = ApiGetUserInvoicesQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const data = await handleGetUserInvoices({ ...query, customer: customerId });

    return NextResponse.json(data);
  }
);