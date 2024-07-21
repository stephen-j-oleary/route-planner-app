"use server";

import { cookies } from "next/headers";

import { postUserRoute } from "@/app/api/user/routes/actions";
import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";
import { auth } from "@/utils/auth";


export async function handleSave(data: ApiPostUserRouteData) {
  const { userId, customerId } = await auth(cookies());
  if (!userId || !customerId) return;

  await postUserRoute({ ...data, userId });
}