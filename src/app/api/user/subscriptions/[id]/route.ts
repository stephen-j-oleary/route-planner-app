import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { array, boolean, date, InferType, number, object } from "yup";
import { string } from "yup";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import compareMongoIds from "@/utils/compareMongoIds";
import stripeClientNext from "@/utils/stripeClient/next";


export type ApiGetUserSubscriptionByIdResponse = Awaited<ReturnType<typeof handleGetUserSubscriptionById>>;

export async function handleGetUserSubscriptionById(id: string) {
  return await stripeClientNext.subscriptions.retrieve(id);
}

export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");
    if (!customerId) throw new ApiError(403, "User not authorized");

    const { id } = params;

    const subscription = await handleGetUserSubscriptionById(id);
    if (!subscription) throw new ApiError(404, "Not found");

    const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ApiError(403, "User not authorized");

    return NextResponse.json(subscription);
  }
);


const ApiPatchUserSubscriptionByIdBodySchema = object()
  .shape({
    items: array(object({
      id: string().optional(),
      deleted: boolean().optional(),
      plan: string().optional(),
      price: string().optional(),
      quantity: number().optional(),
    })),
    cancel_at: date().optional(),
    cancel_at_period_end: boolean().optional(),
    default_payment_method: string().optional(),
  })
  .required()
  .noUnknown();
export type ApiPatchUserSubscriptionByIdBody = InferType<typeof ApiPatchUserSubscriptionByIdBodySchema>;
export type ApiPatchUserSubscriptionByIdResponse = Awaited<ReturnType<typeof handlePatchUserSubscriptionById>>;

export async function handlePatchUserSubscriptionById(id: string, { cancel_at, ...body }: ApiPatchUserSubscriptionByIdBody) {
  return await stripeClientNext.subscriptions.update(id, {
    cancel_at: cancel_at && cancel_at.valueOf() / 1000,
    ...body,
  });
}

export const PATCH: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");
    if (!customerId) throw new ApiError(403, "User not authorized");

    const { id } = params;

    const body = await ApiPatchUserSubscriptionByIdBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const subscription = await handleGetUserSubscriptionById(id);
    if (!subscription) throw new ApiError(404, "Not found");

    const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ApiError(403, "User not authorized");

    const updatedSubscription = await handlePatchUserSubscriptionById(id, body);

    return NextResponse.json(updatedSubscription);
  }
);


export type ApiDeleteUserSubscriptionByIdResponse = Awaited<ReturnType<typeof handleDeleteUserSubscriptionById>>;

export async function handleDeleteUserSubscriptionById(id: string) {
  await stripeClientNext.subscriptions.cancel(id);
}

export const DELETE: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");
    if (!customerId) throw new ApiError(403, "User not authorized");

    const { id } = params;

    const subscription = await handleGetUserSubscriptionById(id);
    if (!subscription) throw new ApiError(404, "Not found");

    const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ApiError(403, "User not authorized");

    await handleDeleteUserSubscriptionById(id);

    return new NextResponse(null, { status: 204 });
  }
);