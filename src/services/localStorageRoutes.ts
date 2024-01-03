import JSONCrush from "jsoncrush";
import { filter, orderBy } from "lodash";

import LocalRoute, { LocalRouteConstructorProps } from "@/models/LocalRoute";
import localStorageClient from "@/utils/localStorageClient";

const RECENT_ROUTES_LIMIT = 10;


const getItems = () => {
  const items = localStorageClient?.getItem("routes");
  return items ? JSON.parse(JSONCrush.uncrush(items)) : [];
};
const setItems = (items: LocalRoute[] = []) => {
  localStorageClient?.setItem("routes", JSONCrush.crush(JSON.stringify(items)));
}


export type GetLocalStorageRoutesReturn = Awaited<ReturnType<typeof getLocalStorageRoutes>>

export async function getLocalStorageRoutes(params = {}) {
  let items: LocalRoute[] = getItems();
  items = orderBy(items, ["createdAt"], ["desc"]);
  items = items.map(item => new LocalRoute(item));

  return filter(items, params);
}

export async function getLocalStorageRoutesByUser(userId: string | undefined, params = {}) {
  if (!userId) return [];

  return getLocalStorageRoutes({
    userId,
    ...params,
  });
}

export async function getLocalStorageRouteById(id: string | undefined) {
  if (!id) return null;

  return (await getLocalStorageRoutes({
    _id: id,
  }))[0];
}

export async function createLocalStorageRoute(data: LocalRouteConstructorProps) {
  const items = getItems();
  const route = new LocalRoute(data);

  setItems([
    ...orderBy(items, ["createdAt"], ["desc"])
      .slice(0, RECENT_ROUTES_LIMIT - 1),
    route,
  ]);

  return route;
}

export async function deleteLocalStorageRouteById(id: string) {
  const items: LocalRoute[] = getItems();

  setItems(items.filter(item => item._id !== id));
}