import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

import { ApiError } from "@/utils/ApiErrors";


export default async function error(error: unknown, _req: NextApiRequest, res: NextApiResponse) {
  console.error(error);

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map(({ path, message }) => ([path, message]));

    return res.status(400).json({
      message: `Invalid request: ${error.message}`,
      field: Object.fromEntries(errors),
    });
  }

  if (error instanceof mongoose.Error) {
    if (error.message.startsWith("E11000")) {
      return res.status(409).json({
        message: "Duplicate field",
      });
    }

    return res.status(500).json({
      message: error.message,
    });
  }

  if (error instanceof Stripe.errors.StripeError) {
    switch (error.type) {
      case "StripeCardError":
        return res.status(400).json({
          message: `Card error: ${error.message}`,
        });

      case "StripeRateLimitError":
        return res.status(429).json({
          message: "Too many requests",
        });

      case "StripeInvalidRequestError":
        return res.status(400).json({
          message: `Invalid request: ${error.message}`,
        });

      case "StripeAPIError":
      case "StripeConnectionError":
        return res.status(500).json({
          message: `An error occured contacting the payment portal: ${error.message}`,
        });

      case "StripeAuthenticationError":
        return res.status(401).json({
          message: `Not authorized: ${error.message}`,
        });
    }
  }

  if (error instanceof ApiError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  if (error instanceof Error) return res.status(500).json(error);

  return res.status(500).json({
    message: "Unknown error",
  });
}