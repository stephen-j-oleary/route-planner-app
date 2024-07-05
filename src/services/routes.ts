"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiDeleteUserRouteByIdResponse, ApiGetUserRouteByIdResponse } from "@/app/api/user/routes/[id]/route";
import { ApiGetUserRoutesResponse, ApiPostUserRouteData, ApiPostUserRouteResponse } from "@/app/api/user/routes/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserRoutes() {
  return await fetchJson<ApiGetUserRoutesResponse>(
    pages.api.userRoutes,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
}


export async function getUserRouteById(id: string) {
  return await fetchJson<ApiGetUserRouteByIdResponse>(
    `${pages.api.userRoutes}/${id}`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
}


export async function createUserRoute(routeData: ApiPostUserRouteData) {
  const data = await fetchJson<ApiPostUserRouteResponse>(
    pages.api.userRoutes,
    {
      method: "POST",
      data: routeData,
      headers: { Cookie: cookies().toString() },
    },
  );

  revalidatePath(pages.api.userRoutes);

  return data;
}


export async function deleteUserRouteById(id: string) {
  const data = await fetchJson<ApiDeleteUserRouteByIdResponse>(
    `${pages.api.userRoutes}/${id}`,
    {
      method: "DELETE",
      headers: { Cookie: cookies().toString() },
    },
  );

  revalidatePath(pages.api.userRoutes);

  return data;
}