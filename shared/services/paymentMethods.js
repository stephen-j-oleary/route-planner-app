import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/pay/paymentMethods";


export async function getPaymentMethodsByCustomer(customer, params = {}) {
  if (!customer) return [];

  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params: { customer, ...params },
  });

  return data;
}

export async function getPaymentMethodById(id, params = {}) {
  if (!id) return null;

  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}

export async function deletePaymentMethodById(id) {
  const { data } = await httpClient.request({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}