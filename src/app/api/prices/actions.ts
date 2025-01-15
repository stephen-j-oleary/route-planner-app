"use server";

import { ApiError } from "next/dist/server/api-utils";

import { ApiGetPriceByIdQuery, ApiGetPricesQuery } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getPrices({ id, expand, ...query }: ApiGetPricesQuery) {
  const data = id
    ? [await getPriceById(id, { expand: expand?.map(item => item.replace("data.", "")) })]
    : (await stripeClientNext.prices.list({ expand, ...query })).data;
  if (!data) throw new ApiError(404, "Prices not found");

  return data;
}

export async function getPriceById(id: string, params: ApiGetPriceByIdQuery = {}) {
  const price = await stripeClientNext.prices.retrieve(id, params);
  if (!price) throw new ApiError(404, "Price not found");

  return price;
}