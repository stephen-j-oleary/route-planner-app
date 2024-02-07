import { MongooseError } from "mongoose";
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