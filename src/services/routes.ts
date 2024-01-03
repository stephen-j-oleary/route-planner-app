import { merge, unionBy } from "lodash";

import { getDatabaseRouteById, getDatabaseRoutes } from "@/services/databaseRoutes";
import { getLocalStorageRouteById, getLocalStorageRoutes } from "@/services/localStorageRoutes";


export type GetRoutesReturn = Awaited<ReturnType<typeof getRoutes>>

export async function getRoutes(params = {}) {
  const results = await Promise.allSettled([
    getDatabaseRoutes(params),
    getLocalStorageRoutes(params),
  ]);
  for (const promise of results) {
    if (promise.status === "rejected") console.error(promise.reason);
  }

  return unionBy(
    results.flatMap(item => (item.status === "fulfilled" ? [item.value] : [])),
    "_id"
  );
}

export type GetRouteByIdReturn = Awaited<ReturnType<typeof getRouteById>>;

export async function getRouteById(id: string | undefined) {
  if (!id) return null;

  const results = await Promise.allSettled([
    getDatabaseRouteById(id),
    getLocalStorageRouteById(id),
  ]);
  for (const promise of results) {
    if (promise.status === "rejected") console.error(promise.reason);
  }

  const data = merge(
    {},
    ...results.flatMap(item => (item.status === "fulfilled" ? [item.value] : [])),
  );
  return data;
}