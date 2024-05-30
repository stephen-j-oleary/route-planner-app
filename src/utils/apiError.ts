import mongoose from "mongoose";
import { ApiError } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { AppRouteHandler } from "@/types/next";


export { ApiError };

export function handleApiError(err: unknown) {
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(({ path, message }) => ([path, message]));

    return NextResponse.json(
      {
        message: `Invalid request: ${err.message}`,
        field: Object.fromEntries(errors),
      },
      { status: 400 },
    );
  }

  if (err instanceof mongoose.Error && err.message.startsWith("E11000")) {
    return NextResponse.json(
      { message: "Duplicate field" },
      { status: 409 },
    );
  }

  if (err instanceof Stripe.errors.StripeError) {
    switch (err.type) {
      case "StripeCardError":
        return NextResponse.json(
          { message: `Card error: ${err.message}` },
          { status: 400 },
        );

      case "StripeRateLimitError":
        return NextResponse.json(
          { message: "Too many requests" },
          { status: 429 },
        );

      case "StripeInvalidRequestError":
        return NextResponse.json(
          { message: `Invalid request: ${err.message}` },
          { status: 400 },
        );

      case "StripeAPIError":
      case "StripeConnectionError":
        return NextResponse.json(
          { message: `An error occured contacting the payment portal: ${err.message}` },
          { status: 500 },
        );

      case "StripeAuthenticationError":
        return NextResponse.json(
          { message: `Not authorized: ${err.message}` },
          { status: 401 },
        );
    }
  }

  return NextResponse.json(err, { status: (err instanceof ApiError) ? err.statusCode : 500 });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function apiErrorHandler<THandler extends (...args: any[]) => Promise<NextResponse> = AppRouteHandler>(routeHandler: THandler): THandler {
  return (async (...args) => {
    try {
      return routeHandler(...args);
    }
    catch (err) {
      return handleApiError(err);
    }
  }) as THandler;
}