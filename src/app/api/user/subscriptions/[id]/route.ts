import { NextResponse } from "next/server";

import { deleteUserSubscriptionById, getUserSubscriptionById, patchUserSubscriptionById } from "./actions";
import { ApiPatchUserSubscriptionByIdBodySchema } from "./schemas";
import pages from "@/pages";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";


export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {}, customer: { id: customerId } = {} } = await auth(pages.api.userSubscriptions).api();
    if (!userId) throw new ApiError(401, "User required");
    if (!customerId) throw new ApiError(403, "User not authorized");

    const { id } = await params;

    const subscription = await getUserSubscriptionById(id);
    if (!subscription) throw new ApiError(404, "Not found");

    return NextResponse.json(subscription);
  }
);


export const PATCH: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {}, customer: { id: customerId } = {} } = await auth(pages.api.userSubscriptions).api();
    if (!userId) throw new ApiError(401, "User required");
    if (!customerId) throw new ApiError(403, "User not authorized");

    const { id } = await params;

    const body = await ApiPatchUserSubscriptionByIdBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await patchUserSubscriptionById(id, body)
    );
  }
);


export const DELETE: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {}, customer: { id: customerId } = {} } = await auth(pages.api.userSubscriptions).api();
    if (!userId) throw new ApiError(401, "User required");
    if (!customerId) throw new ApiError(403, "User not authorized");

    const { id } = await params;

    await deleteUserSubscriptionById(id);

    return new NextResponse(null, { status: 204 });
  }
);