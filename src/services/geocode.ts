import { ApiGetGeocodeQuery, ApiGetGeocodeResponse } from "@/pages/api/geocode";
import httpClient from "@/utils/httpClient";


export type GetGeocodeParams = ApiGetGeocodeQuery;
export type GetGeocodeResult = Awaited<ReturnType<typeof getGeocode>>;

export async function getGeocode(params: GetGeocodeParams) {
  const { data } = await httpClient.request<ApiGetGeocodeResponse>({
    method: "get",
    url: "api/geocode",
    params,
  });

  return data;
}