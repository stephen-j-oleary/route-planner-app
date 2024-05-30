"use server";

import { cookies } from "next/headers";

import { ApiGetUserCustomerResponse } from "@/app/api/user/customer/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserCustomer() {
  const res = await fetchJson(
    pages.api.userCustomer,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUserCustomerResponse;
}