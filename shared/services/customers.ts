import { ApiPostCustomerBody, ApiPostCustomerResponse } from "@/pages/api/pay/customers";
import { ApiGetCustomerQuery, ApiGetCustomerResponse } from "@/pages/api/pay/customers/[customerId]";
import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/pay/customers";


export type GetCustomerByIdParams = Omit<ApiGetCustomerQuery, "customerId">;
export type GetCustomerByIdReturn = Awaited<ReturnType<typeof getCustomerById>>;

export async function getCustomerById(id: string, params: GetCustomerByIdParams = {}) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetCustomerResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}

export async function createCustomer(customerData: ApiPostCustomerBody) {
  const { data } = await httpClient.request<ApiPostCustomerResponse>({
    method: "post",
    url: BASE_PATH,
    data: customerData,
  });

  return data;
}