import { ApiGetRoutesQuery, ApiGetRoutesResponse } from "@/pages/api/routes";
import { ApiGetRouteByIdResponse } from "@/pages/api/routes/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/routes";


export type GetDatabaseRoutesParams = ApiGetRoutesQuery
export type GetDatabaseRoutesReturn = Awaited<ReturnType<typeof getDatabaseRoutes>>

export async function getDatabaseRoutes(params: GetDatabaseRoutesParams = {}) {
  const { data } = await httpClient.request<ApiGetRoutesResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export type GetDatabaseRouteByIdReturn = Awaited<ReturnType<typeof getDatabaseRouteById>>;

export async function getDatabaseRouteById(id: string | undefined) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetRouteByIdResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}

export async function createDatabaseRoute(route) {
  const { data } = await httpClient.request({
    method: "post",
    url: BASE_PATH,
    data: route,
  });

  return data;
}

export async function deleteDatabaseRouteById(id: string) {
  const { data } = await httpClient.request({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}