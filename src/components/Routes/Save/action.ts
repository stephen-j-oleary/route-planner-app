"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { postUserRoute } from "@/app/api/user/routes/actions";
import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";
import { auth } from "@/utils/auth";
import { features, hasFeatureAccess } from "@/utils/features";
import pages from "pages";


export async function handleSave(data: ApiPostUserRouteData) {
  const { userId } = await auth(cookies());
  if (!userId || !(await hasFeatureAccess(features.routes_save, cookies()))) return;

  const result = await postUserRoute({ ...data, userId });

  redirect(`${pages.routes.root}/${result?.id}`);
}