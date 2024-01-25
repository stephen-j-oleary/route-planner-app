import { AxiosError } from "axios";

import Route, { IRoute } from "@/models/Route";
import { ApiGetRoutesResponse, ApiPostRouteData, ApiPostRouteResponse } from "@/pages/api/routes";
import { ApiDeleteRouteResponse, ApiGetRouteByIdResponse } from "@/pages/api/routes/[id]";
import { ApiError } from "@/utils/ApiErrors";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/routes";


export type GetRoutesReturn = Awaited<ReturnType<typeof getRoutes>>
/**
 * Retrieve routes from database
 */
export async function getRoutes() {
  const { data } = await httpClient.request<ApiGetRoutesResponse>({
    method: "get",
    url: BASE_PATH,
  });

  return data;
}

export type GetRoutesLocalReturn = Awaited<ReturnType<typeof getRoutesLocal>>
/**
 * Retrieve routes from session storage
 */
export async function getRoutesLocal(): Promise<IRoute[]> {
  const storageStr = sessionStorage.getItem(BASE_PATH);
  return storageStr ? JSON.parse(storageStr) : [];
}

export type GetRouteByIdReturn = Awaited<ReturnType<typeof getRouteById>>
/**
 * Retrieve a specific route from the database
 */
export async function getRouteById(id: string | undefined) {
  if (!id) return null;

  try {
    const { data } = await httpClient.request<ApiGetRouteByIdResponse>({
      method: "get",
      url: `${BASE_PATH}/${id}`,
    });

    return data;
  }
  catch (err) {
    if (typeof err == "string") throw new ApiError({ message: err });
    if (err instanceof AxiosError) throw new ApiError({ status: err.response?.status, message: err.response?.data.message });
    throw err;
  }
}

export type GetRouteLocalByIdReturn = Awaited<ReturnType<typeof getRouteLocalById>>;
/**
 * Retrieve a specific route from session storage
 */
export async function getRouteLocalById(id: string | undefined) {
  if (!id) return null;

  const routes = await getRoutesLocal();
  return routes.find(item => item._id === id);
}


export type CreateRouteData = ApiPostRouteData;
export type CreateRouteReturn = Awaited<ReturnType<typeof createRoute>>;
/**
 * Store a route to the database
 */
export async function createRoute(data: CreateRouteData) {
  const res = await httpClient.request<ApiPostRouteResponse>({
    method: "post",
    url: BASE_PATH,
    data,
  });

  return res.data;
}

export type CreateRouteLocalData = { userId: string } & ApiPostRouteData;
/**
 * Store a route in session storage
 */
export async function createRouteLocal(data: CreateRouteLocalData) {
  const routes = await getRoutesLocal();
  const newRoute = new Route(data);
  const error = newRoute.validateSync();
  if (error) throw error;
  sessionStorage.setItem(BASE_PATH, JSON.stringify([...routes, newRoute]));
  return newRoute;
}

export type DeleteRouteByIdReturn = Awaited<ReturnType<typeof deleteRouteById>>;
/**
 * Delete a route from the database
 */
export async function deleteRouteById(id: string) {
  const { data } = await httpClient.request<ApiDeleteRouteResponse>({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}

/**
 * Delete a route from session storage
 */
export async function deleteRouteLocalById(id: string) {
  const routes = await getRoutesLocal();
  const newRoutes = routes.filter(item => item._id !== id);
  sessionStorage.setItem(BASE_PATH, JSON.stringify(newRoutes));
  return;
}