import "client-only";

import { revalidatePath } from "next/cache";

import { ApiDeleteUserRouteByIdResponse } from "@/app/api/user/routes/[id]/route";
import { ApiPostUserRouteData, ApiPostUserRouteResponse } from "@/app/api/user/routes/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function createUserRoute(routeData: ApiPostUserRouteData) {
  const data = await fetchJson<ApiPostUserRouteResponse>(
    pages.api.userRoutes,
    {
      method: "POST",
      data: routeData,
    },
  );

  revalidatePath(pages.api.userRoutes);

  return data;
}


export async function deleteUserRouteById(id: string) {
  const data = await fetchJson<ApiDeleteUserRouteByIdResponse>(
    `${pages.api.userRoutes}/${id}`,
    { method: "DELETE" },
  );

  revalidatePath(pages.api.userRoutes);

  return data;
}