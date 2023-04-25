import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/pay/invoices";


export async function getInvoices(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export async function getUpcomingInvoice(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/upcoming`,
    params,
  });

  return data;
}

export async function createUpcomingInvoice(invoice) {
  const { data } = await httpClient.request({
    method: "post",
    url: `${BASE_PATH}/upcoming`,
    data: invoice,
  });

  return data;
}