"use server";

import { cookies } from "next/headers";

import { ApiGetUserCustomerResponse } from "@/app/api/user/customer/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserCustomer() {
  return await fetchJson<ApiGetUserCustomerResponse>(
    pages.api.userCustomer,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
}