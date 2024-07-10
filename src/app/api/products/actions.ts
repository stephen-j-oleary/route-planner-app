"use server";

import { ApiGetProductsQuery } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getProducts(params: ApiGetProductsQuery = {}) {
  const { data } = await stripeClientNext.products.list(params);
  return data;
}