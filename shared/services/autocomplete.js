import httpClient from "@/shared/utils/httpClient";


export async function getAutocomplete(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: "api/autocomplete",
    params,
  });
  return data;
}