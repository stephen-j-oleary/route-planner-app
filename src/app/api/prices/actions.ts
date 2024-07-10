"use server";

import { ApiError } from "next/dist/server/api-utils";

import { ApiGetPricesQuery } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getPrices(query: ApiGetPricesQuery) {
  const { data } = await stripeClientNext.prices.list(query);
  if (!data) throw new ApiError(404, "Prices not found");

  return data;
}