import { ApiGetUserInvoicesQuery, ApiGetUserInvoicesResponse } from "@/pages/api/user/invoices";
import { ApiGetUserUpcomingInvoiceQuery, ApiGetUserUpcomingInvoiceResponse, ApiPostUserUpcomingInvoiceBody, ApiPostUserUpcomingInvoiceResponse } from "@/pages/api/user/invoices/upcoming";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/user/invoices";


export type GetUserInvoicesParams = ApiGetUserInvoicesQuery;
export type GetUserInvoicesReturn = ReturnType<typeof getUserInvoices>;

export async function getUserInvoices(params: GetUserInvoicesParams = {}) {
  const { data } = await httpClient.request<ApiGetUserInvoicesResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}


export type GetUserUpcomingInvoiceParams = ApiGetUserUpcomingInvoiceQuery;
export type GetUserUpcomingInvoiceReturn = ReturnType<typeof getUserUpcomingInvoice>;

export async function getUserUpcomingInvoice(params: GetUserUpcomingInvoiceParams = {}) {
  const { data } = await httpClient.request<ApiGetUserUpcomingInvoiceResponse>({
    method: "get",
    url: `${BASE_PATH}/upcoming`,
    params,
  });

  return data;
}


export type CreateUserUpcomingInvoiceData = ApiPostUserUpcomingInvoiceBody;
export type CreateUserUpcomingInvoiceReturn = ReturnType<typeof createUserUpcomingInvoice>;

export async function createUserUpcomingInvoice(data: CreateUserUpcomingInvoiceData) {
  const res = await httpClient.request<ApiPostUserUpcomingInvoiceResponse>({
    method: "post",
    url: `${BASE_PATH}/upcoming`,
    data,
  });

  return res.data;
}