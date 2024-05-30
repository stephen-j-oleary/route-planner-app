"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiGetUserResponse, ApiPatchUserBody, ApiPatchUserResponse } from "@/app/api/user/route";
import { ApiGetUsersQuery, ApiGetUsersResponse } from "@/app/api/users/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUsers(params: ApiGetUsersQuery) {
  const res = await fetchJson(
    pages.api.users,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUsersResponse;
}


export async function getUser() {
  const res = await fetchJson(
    pages.api.user,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) {
    if ([401, 403, 404].includes(res.status)) return null;
    throw data;
  }

  return data as ApiGetUserResponse;
}


export async function updateUser(changes: ApiPatchUserBody) {
  const res = await fetchJson(
    pages.api.user,
    {
      method: "PATCH",
      data: changes,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.user);

  return data as ApiPatchUserResponse;
}


export async function deleteUser() {
  const res = await fetchJson(
    pages.api.user,
    {
      method: "DELETE",
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.user);

  return;
}