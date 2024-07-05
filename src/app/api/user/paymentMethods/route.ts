import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { array, InferType, object, string } from "yup";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth/server";
import stripeClientNext from "@/utils/stripeClient/next";



const ApiGetUserPaymentMethodsQuerySchema = object()
  .shape({
    expand: array(string().required()).optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserPaymentMethodsQuery = InferType<typeof ApiGetUserPaymentMethodsQuerySchema>;
export type ApiGetUserPaymentMethodsResponse = Awaited<ReturnType<typeof handleGetUserPaymentMethods>>;
export async function handleGetUserPaymentMethods({ customer, ...query }: ApiGetUserPaymentMethodsQuery & { customer?: string }) {
  if (!customer) return [];
  const { data } = await stripeClientNext.paymentMethods.list({ customer, ...query });
  return data;
}

export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    const query = await ApiGetUserPaymentMethodsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const data = await handleGetUserPaymentMethods({ ...query, customer: customerId });

    return NextResponse.json(data);
  }
);