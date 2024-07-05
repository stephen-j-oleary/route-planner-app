import "client-only";

import { revalidatePath } from "next/cache";

import { ApiPatchUserBody, ApiPatchUserResponse } from "@/app/api/user/route";
import { ApiGetUsersQuery, ApiGetUsersResponse } from "@/app/api/users/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getUsers(params: ApiGetUsersQuery) {
  return await fetchJson<ApiGetUsersResponse>(
    pages.api.users,
    {
      method: "GET",
      query: params,
    },
  );
}


export async function updateUser(changes: ApiPatchUserBody) {
  const data = await fetchJson<ApiPatchUserResponse>(
    pages.api.user,
    {
      method: "PATCH",
      data: changes,
    },
  );

  revalidatePath(pages.api.user);

  return data;
}


export async function deleteUser() {
  await fetchJson(
    pages.api.user,
    { method: "DELETE" },
  );

  revalidatePath(pages.api.user);

  return;
}