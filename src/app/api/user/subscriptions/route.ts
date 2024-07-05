import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InferType, object, string } from "yup";
import { array } from "yup";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth/server";
import stripeClientNext from "@/utils/stripeClient/next";


const ApiGetUserSubscriptionsQuerySchema = object()
  .shape({
    expand: array(string().required()).optional(),
    plan: string().optional(),
    price: string().optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserSubscriptionsQuery = InferType<typeof ApiGetUserSubscriptionsQuerySchema>;
export type ApiGetUserSubscriptionsResponse = Awaited<ReturnType<typeof handleGetUserSubscriptions>>;

export async function handleGetUserSubscriptions({ customer, ...query }: ApiGetUserSubscriptionsQuery & { customer?: string }) {
  if (!customer) return [];
  const { data } = await stripeClientNext.subscriptions.list({ customer, ...query });
  return data;
}

export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");
    if (!customerId) throw new ApiError(403, "User not authorized");

    const query = await ApiGetUserSubscriptionsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const data = await handleGetUserSubscriptions({ ...query, customer: customerId });

    return NextResponse.json(data);
  }
);