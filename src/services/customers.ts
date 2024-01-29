import { ApiGetUserCustomerResponse } from "@/pages/api/user/customer";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/user/customer";


export type GetUserCustomerReturn = ReturnType<typeof getUserCustomer>;

export async function getUserCustomer() {
  const { data } = await httpClient.request<ApiGetUserCustomerResponse>({
    method: "get",
    url: BASE_PATH,
  });

  return data;
}