import { ApiGetInvoicesQuery, ApiGetInvoicesResponse } from "@/pages/api/pay/invoices";
import { ApiGetUpcomingInvoiceQuery, ApiGetUpcomingInvoiceResponse, ApiPostUpcomingInvoiceBody, ApiPostUpcomingInvoiceResponse } from "@/pages/api/pay/invoices/upcoming";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/pay/invoices";


export type GetInvoicesParams = ApiGetInvoicesQuery;
export type GetInvoicesReturn = Awaited<ReturnType<typeof getInvoices>>;

export async function getInvoices(params: GetInvoicesParams = {}) {
  const { data } = await httpClient.request<ApiGetInvoicesResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export type GetUpcomingInvoiceParams = ApiGetUpcomingInvoiceQuery;
export type GetUpcomingInvoiceReturn = Awaited<ReturnType<typeof getUpcomingInvoice>>;

export async function getUpcomingInvoice(params: GetUpcomingInvoiceParams = {}) {
  const { data } = await httpClient.request<ApiGetUpcomingInvoiceResponse>({
    method: "get",
    url: `${BASE_PATH}/upcoming`,
    params,
  });

  return data;
}

export type CreateUpcomingInvoiceData = ApiPostUpcomingInvoiceBody;
export type CreateUpcomingInvoiceReturn = Awaited<ReturnType<typeof createUpcomingInvoice>>;

export async function createUpcomingInvoice(data: CreateUpcomingInvoiceData) {
  const res = await httpClient.request<ApiPostUpcomingInvoiceResponse>({
    method: "post",
    url: `${BASE_PATH}/upcoming`,
    data,
  });

  return res.data;
}