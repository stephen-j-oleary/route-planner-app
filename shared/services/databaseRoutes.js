import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/routes";


export async function getDatabaseRoutes(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export async function getDatabaseRouteById(id, params = {}) {
  if (!id) return null;

  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
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

export async function deleteDatabaseRouteById(id) {
  const { data } = await httpClient.request({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}