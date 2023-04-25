import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/pay/customer";


export async function getCustomerById(id, params = {}) {
  if (!id) return null;

  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}