"use server";

import { cookies } from "next/headers";

import { ApiGetUserInvoicesQuery, ApiGetUserInvoicesResponse } from "@/app/api/user/invoices/route";
import { ApiGetUserUpcomingInvoiceQuery, ApiGetUserUpcomingInvoiceResponse, ApiPostUserUpcomingInvoiceBody, ApiPostUserUpcomingInvoiceResponse } from "@/app/api/user/invoices/upcoming/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserInvoices(params: ApiGetUserInvoicesQuery = {}) {
  return await fetchJson<ApiGetUserInvoicesResponse>(
    pages.api.userInvoices,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
}


export async function getUserUpcomingInvoice(params: ApiGetUserUpcomingInvoiceQuery = {}) {
  return await fetchJson<ApiGetUserUpcomingInvoiceResponse>(
    pages.api.userUpcomingInvoices,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
}


export async function createUserUpcomingInvoice(invoiceData: ApiPostUserUpcomingInvoiceBody) {
  return await fetchJson<ApiPostUserUpcomingInvoiceResponse>(
    pages.api.userUpcomingInvoices,
    {
      method: "POST",
      data: invoiceData,
      headers: { Cookie: cookies().toString() },
    },
  );
}