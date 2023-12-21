import httpClient from "@/utils/httpClient";


export async function getDirections(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: "api/directions",
    params,
  });

  return data;
}