import "client-only";

import { ApiPostUserUpcomingInvoiceBody, ApiPostUserUpcomingInvoiceResponse } from "@/app/api/user/invoices/upcoming/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function createUserUpcomingInvoice(invoiceData: ApiPostUserUpcomingInvoiceBody) {
  return await fetchJson<ApiPostUserUpcomingInvoiceResponse>(
    pages.api.userUpcomingInvoices,
    {
      method: "POST",
      data: invoiceData,
    },
  );
}