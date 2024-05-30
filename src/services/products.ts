"use server";

import { cookies } from "next/headers";

import { ApiGetProductByIdResponse } from "@/app/api/products/[id]/handlers";
import { ApiGetProductsQuery, ApiGetProductsResponse } from "@/app/api/products/handlers";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getProducts(params: ApiGetProductsQuery = {}) {
  const res = await fetchJson(
    pages.api.products,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetProductsResponse;
}


export async function getProductById(id: string) {
  const res = await fetchJson(
    `${pages.api.products}/${id}`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetProductByIdResponse;
}