"use server";

import { ApiError } from "next/dist/server/api-utils";

import { ApiGetPriceByIdQuery } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getPriceById(id: string, params: ApiGetPriceByIdQuery = {}) {
  const price = await stripeClientNext.prices.retrieve(id, params);
  if (!price) throw new ApiError(404, "Price not found");

  return price;
}