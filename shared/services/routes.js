import { unionBy } from "lodash";

import { getDatabaseRouteById, getDatabaseRoutes } from "@/shared/services/databaseRoutes";
import { getLocalStorageRouteById, getLocalStorageRoutes } from "@/shared/services/localStorageRoutes";


export async function getRoutes(params = {}) {
  const results = await Promise.allSettled([
    getDatabaseRoutes(params),
    getLocalStorageRoutes(params),
  ]);
  const successResults = results.filter(res => res.status === "fulfilled");
  if (successResults.length === 0) throw results[0].reason;

  const data = unionBy(
    successResults.map(item => item.value),
    "_id"
  );
  return data;
}

export async function getRouteById(id, params = {}) {
  if (!id) return null;

  const results = await Promise.allSettled([
    getDatabaseRouteById(id, params),
    getLocalStorageRouteById(id, params),
  ]);
  const successResults = results.filter(res => res.status === "fulfilled");
  if (successResults.length === 0) throw results[0].reason;

  const data = successResults[0].value;
  return data;
}