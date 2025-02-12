import { NextResponse } from "next/server";

import { postUserCheckoutSession } from "./actions";
import { ApiPostUserCheckoutSessionBodySchema } from "./schemas";
import pages from "@/pages";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";


export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { user: { id: userId, email } = {}, customer: { id: customerId } = {} } = await auth(pages.api.userCheckoutSession).api();
    if (!userId) throw new ApiError(401, "User required");

    const body = await ApiPostUserCheckoutSessionBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await postUserCheckoutSession({
        ...body,
        customer: customerId || undefined,
        customer_email: !customerId && email || undefined,
      })
    );
  }
);