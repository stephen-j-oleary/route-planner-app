"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { postUserRoute } from "@/app/api/user/routes/actions";
import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";
import pages from "@/pages";
import auth from "@/utils/auth";
import { checkFeature, features } from "@/utils/features";


export async function handleSave(data: ApiPostUserRouteData) {
  const { user: { id: userId } = {} } = await auth(cookies()).api();
  if (!userId || !(await checkFeature(features.routes_save))) return;

  const result = await postUserRoute({ ...data, userId });

  redirect(`${pages.routes.root}/${result?.id}`);
}