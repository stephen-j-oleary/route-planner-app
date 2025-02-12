"use server";

import { redirect } from "next/navigation";

import { postUserRoute } from "@/app/api/user/routes/actions";
import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";
import pages from "@/pages";


export async function handleSave(data: ApiPostUserRouteData) {
  const result = await postUserRoute(data);

  redirect(`${pages.routes.id}${result?.id}`);
}