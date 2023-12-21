import httpClient from "@/utils/httpClient";


export async function getAutocomplete(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: "api/autocomplete",
    params,
  });
  return data;
}