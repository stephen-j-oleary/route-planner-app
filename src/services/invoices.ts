"use server";

import { cookies } from "next/headers";

import { ApiGetUserInvoicesQuery, ApiGetUserInvoicesResponse } from "@/app/api/user/invoices/route";
import { ApiGetUserUpcomingInvoiceQuery, ApiGetUserUpcomingInvoiceResponse, ApiPostUserUpcomingInvoiceBody, ApiPostUserUpcomingInvoiceResponse } from "@/app/api/user/invoices/upcoming/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserInvoices(params: ApiGetUserInvoicesQuery = {}) {
  const res = await fetchJson(
    pages.api.userInvoices,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUserInvoicesResponse;
}


export async function getUserUpcomingInvoice(params: ApiGetUserUpcomingInvoiceQuery = {}) {
  const res = await fetchJson(
    pages.api.userUpcomingInvoices,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUserUpcomingInvoiceResponse;
}


export async function createUserUpcomingInvoice(invoiceData: ApiPostUserUpcomingInvoiceBody) {
  const res = await fetchJson(
    pages.api.userUpcomingInvoices,
    {
      method: "POST",
      data: invoiceData,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiPostUserUpcomingInvoiceResponse;
}