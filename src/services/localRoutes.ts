"use client";

import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";
import Route, { IRoute } from "@/models/Route";

const SESSION_STORAGE_KEY = "loop-routes";


export async function getLocalRoutes() {
  const storageStr = sessionStorage.getItem(SESSION_STORAGE_KEY);
  return (storageStr ? JSON.parse(storageStr) : []) as IRoute[];
}


export async function getLocalRouteById(id: string) {
  const routes = await getLocalRoutes();
  const route = routes.find(item => item._id === id);
  return route;
}


export async function createLocalRoute(routeData: ApiPostUserRouteData) {
  const routes = await getLocalRoutes();
  const newRoute = new Route(routeData);
  const error = newRoute.validateSync();
  if (error) throw error;
  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify([...routes, newRoute]));
  return newRoute;
}