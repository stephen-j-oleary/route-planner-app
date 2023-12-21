import JSONCrush from "jsoncrush";
import { filter, orderBy } from "lodash";

import LocalRoute from "@/models/LocalRoute";
import localStorageClient from "@/utils/localStorageClient";

const RECENT_ROUTES_LIMIT = 10;


const getItems = () => {
  const items = localStorageClient.getItem("routes");
  return items ? JSON.parse(JSONCrush.uncrush(items)) : [];
};
const setItems = (items = []) => {
  localStorageClient.setItem("routes", JSONCrush.crush(JSON.stringify(items)));
}


export async function getLocalStorageRoutes(params = {}) {
  let items = getItems();
  items = filter(items, params);
  items = orderBy(items, ["createdAt"], ["desc"]);
  items = items.map(item => new LocalRoute(item));

  return items;
}

export async function getLocalStorageRoutesByUser(userId, params = {}) {
  if (!userId) return [];

  return getLocalStorageRoutes({
    userId,
    ...params,
  });
}

export async function getLocalStorageRouteById(id, params = {}) {
  if (!id) return null;

  return (await getLocalStorageRoutes({
    _id: id,
    ...params,
  }))[0];
}

export async function createLocalStorageRoute(data) {
  const items = getItems();
  const route = new LocalRoute(data);

  setItems([
    ...orderBy(items, ["createdAt"], ["desc"])
      .slice(0, RECENT_ROUTES_LIMIT - 1),
    route,
  ]);

  return route;
}

export async function deleteLocalStorageRouteById(id) {
  let items = getItems();
  items = items.filter(item => item._id !== id);

  setItems(items);
}