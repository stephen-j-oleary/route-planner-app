import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { array, InferType, object, string } from "yup";

import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth/server";
import stripeClientNext from "@/utils/stripeClient/next";
import pages from "pages";


const ApiGetUserPaymentMethodByIdQuerySchema = object()
  .shape({
    expand: array(string().required()).optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserPaymentMethodByIdQuery = InferType<typeof ApiGetUserPaymentMethodByIdQuerySchema>;
export type ApiGetUserPaymentMethodByIdResponse = Awaited<ReturnType<typeof handleGetUserPaymentMethodById>>;

export async function handleGetUserPaymentMethodById(id: string, query: ApiGetUserPaymentMethodByIdQuery = {}) {
  return await stripeClientNext.paymentMethods.retrieve(id, query);
}

export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    const { id } = params;
    const query = await ApiGetUserPaymentMethodByIdQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const paymentMethod = await handleGetUserPaymentMethodById(id, query);
    if (!paymentMethod) throw new ApiError(404, "Not found");

    if (paymentMethod.customer !== customerId) throw new ApiError(403, "Forbidden");

    return NextResponse.json(paymentMethod);
  }
);


export type ApiDeleteUserPaymentMethodByIdResponse = Awaited<ReturnType<typeof handleDeleteUserPaymentMethodById>>;

export async function handleDeleteUserPaymentMethodById(id: string) {
  const res = await stripeClientNext.paymentMethods.detach(id);

  revalidatePath(pages.api.userPaymentMethods);

  return res;
}

export const DELETE: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId, customerId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    const { id } = params;

    const paymentMethod = await handleGetUserPaymentMethodById(id);
    if (!paymentMethod) throw new ApiError(404, "Not found");

    if (paymentMethod.customer !== customerId) throw new ApiError(403, "Forbidden");

    const deletedPaymentMethod = await handleDeleteUserPaymentMethodById(id);
    if (!deletedPaymentMethod) throw new ApiError(404, "Not found");

    return new NextResponse(null, { status: 204 });
  }
);