"use server";

import { cookies } from "next/headers";

import { ApiGetProductByIdResponse } from "@/app/api/products/[id]/handlers";
import { ApiGetProductsQuery, ApiGetProductsResponse } from "@/app/api/products/handlers";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getProducts(params: ApiGetProductsQuery = {}) {
  return await fetchJson<ApiGetProductsResponse>(
    pages.api.products,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
}


export async function getProductById(id: string) {
  return await fetchJson<ApiGetProductByIdResponse>(
    `${pages.api.products}/${id}`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
}