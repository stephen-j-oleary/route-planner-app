import { NextResponse } from "next/server";

import { deleteUserPaymentMethodById, getUserPaymentMethodById } from "./actions";
import { ApiGetUserPaymentMethodByIdQuerySchema } from "./schemas";
import pages from "@/pages";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";


export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {} } = await auth(pages.api.userPaymentMethods).api();
    if (!userId) throw new ApiError(401, "Not authorized");

    const { id } = params;
    const query = await ApiGetUserPaymentMethodByIdQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await getUserPaymentMethodById(id, query)
    );
  }
);


export const DELETE: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {} } = await auth(pages.api.userPaymentMethods).api();
    if (!userId) throw new ApiError(401, "Not authorized");

    const { id } = params;

    await deleteUserPaymentMethodById(id);

    return new NextResponse(null, { status: 204 });
  }
);