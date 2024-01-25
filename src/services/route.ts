import { ApiGetRouteQuery, ApiGetRouteResponse } from "@/pages/api/route";
import httpClient from "@/utils/httpClient";


export type GetDirectionsParams = ApiGetRouteQuery;
export type GetDirectionsReturn = Awaited<ReturnType<typeof getRoute>>;

export async function getRoute(params: GetDirectionsParams) {
  const { data } = await httpClient.request<ApiGetRouteResponse>({
    method: "get",
    url: "api/route",
    params,
  });

  return data;
}