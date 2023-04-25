import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/pay/prices";


export async function getPrices(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export async function getPriceById(id, params = {}) {
  if (!id) return null;

  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}