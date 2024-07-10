"use server";

import { ApiError } from "next/dist/server/api-utils";

import stripeClientNext from "@/utils/stripeClient/next";


export async function getProductById(id: string) {
  const product = await stripeClientNext.products.retrieve(id);
  if (!product) throw new ApiError(404, "Product not found");

  return product;
}