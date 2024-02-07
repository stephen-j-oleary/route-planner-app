import * as Sentry from "@sentry/nextjs";
import { isObject } from "lodash";
import { NextApiRequest, NextApiResponse } from "next";

import { handleMongooseError } from "./mongoose";
import { handleStripeError } from "./stripe";


export default async function error(error: unknown, _req: NextApiRequest, res: NextApiResponse) {
  Sentry.captureException(error);
  console.error(error);
  let err: {
    status?: number,
    message?: string,
  } = isObject(error) ? error : {};

  err = handleMongooseError(err);
  err = handleStripeError(err);

  const {
    status = 500,
    message = "Unknown error",
  } = err;

  res.status(status);
  res.json({ message });
}