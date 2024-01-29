import mongoose, { MongooseError } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import connectMongoose from "@/utils/connectMongoose";


export default async function mongooseMiddleware(_req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  try {
    await connectMongoose();
    return next();
  }
  catch (err: unknown) {
    if (err instanceof MongooseError) res.status(500).json({ message: err.message });
    return res.status(500).json(err);
  }
}

export function handleMongooseError(err: unknown) {
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(({ path, message }) => ([path, message]));

    return {
      status: 400,
      message: "Invalid request",
      field: Object.fromEntries(errors),
    };
  }

  if (err instanceof mongoose.Error) {
    if (err.message.startsWith("E11000")) {
      return {
        status: 409,
        message: "Duplicate field",
      };
    }
  }

  return err;
}