import { AxiosError } from "axios";

import Route, { IRoute } from "@/models/Route";
import { ApiGetUserRoutesResponse, ApiPostUserRouteData, ApiPostUserRouteResponse } from "@/pages/api/user/routes";
import { ApiDeleteUserRouteByIdResponse, ApiGetUserRouteByIdResponse } from "@/pages/api/user/routes/[id]";
import { ApiError } from "@/utils/ApiErrors";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/user/routes";


export type GetUserRoutesReturn = ReturnType<typeof getUserRoutes>;
/**
 * Retrieve routes from database
 */
export async function getUserRoutes() {
  const { data } = await httpClient.request<ApiGetUserRoutesResponse>({
    method: "get",
    url: BASE_PATH,
  });

  return data;
}

export type GetLocalRoutesReturn = ReturnType<typeof getLocalRoutes>;
/**
 * Retrieve routes from session storage
 */
export async function getLocalRoutes(): Promise<IRoute[]> {
  const storageStr = sessionStorage.getItem(BASE_PATH);
  return storageStr ? JSON.parse(storageStr) : [];
}

export type GetUserRouteByIdReturn = ReturnType<typeof getUserRouteById>;
/**
 * Retrieve a specific route from the database
 */
export async function getUserRouteById(id: string | undefined) {
  if (!id) return null;

  try {
    const { data } = await httpClient.request<ApiGetUserRouteByIdResponse>({
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

export type GetLocalRouteByIdReturn = Awaited<ReturnType<typeof getLocalRouteById>>;
/**
 * Retrieve a specific route from session storage
 */
export async function getLocalRouteById(id: string | undefined) {
  if (!id) return null;

  const routes = await getLocalRoutes();
  return routes.find(item => item._id === id);
}


export type CreateUserRouteData = ApiPostUserRouteData;
export type CreateUserRouteReturn = ReturnType<typeof createUserRoute>;
/**
 * Store a route to the database
 */
export async function createUserRoute(data: CreateUserRouteData) {
  const res = await httpClient.request<ApiPostUserRouteResponse>({
    method: "post",
    url: BASE_PATH,
    data,
  });

  return res.data;
}

export type CreateLocalRouteData = ApiPostUserRouteData & { userId: string };
/**
 * Store a route in session storage
 */
export async function createLocalRoute(data: CreateLocalRouteData) {
  const routes = await getLocalRoutes();
  const newRoute = new Route(data);
  const error = newRoute.validateSync();
  if (error) throw error;
  sessionStorage.setItem(BASE_PATH, JSON.stringify([...routes, newRoute]));
  return newRoute;
}

export type DeleteUserRouteByIdReturn = Awaited<ReturnType<typeof deleteUserRouteById>>;
/**
 * Delete a route from the database
 */
export async function deleteUserRouteById(id: string) {
  const { data } = await httpClient.request<ApiDeleteUserRouteByIdResponse>({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}

/**
 * Delete a route from session storage
 */
export async function deleteLocalRouteById(id: string) {
  const routes = await getLocalRoutes();
  const newRoutes = routes.filter(item => item._id !== id);
  sessionStorage.setItem(BASE_PATH, JSON.stringify(newRoutes));
  return;
}