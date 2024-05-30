"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiDeleteUserRouteByIdResponse, ApiGetUserRouteByIdResponse } from "@/app/api/user/routes/[id]/route";
import { ApiGetUserRoutesResponse, ApiPostUserRouteData, ApiPostUserRouteResponse } from "@/app/api/user/routes/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUserRoutes() {
  const res = await fetchJson(
    pages.api.userRoutes,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUserRoutesResponse;
}


export async function getUserRouteById(id: string) {
  const res = await fetchJson(
    `${pages.api.userRoutes}/${id}`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUserRouteByIdResponse;
}


export async function createUserRoute(routeData: ApiPostUserRouteData) {
  const res = await fetchJson(
    pages.api.userRoutes,
    {
      method: "POST",
      data: routeData,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.userRoutes);

  return data as ApiPostUserRouteResponse;
}


export async function deleteUserRouteById(id: string) {
  const res = await fetchJson(
    `${pages.api.userRoutes}/${id}`,
    {
      method: "DELETE",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.userRoutes);

  return data as ApiDeleteUserRouteByIdResponse;
}