import { ApiGetUsersQuery, ApiGetUsersResponse } from "@/pages/api/users";
import { ApiGetUserQuery, ApiGetUserResponse } from "@/pages/api/users/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/users";


export type GetUsersParams = ApiGetUsersQuery;
export type GetUsersReturn = Awaited<ReturnType<typeof getUsers>>;

export async function getUsers(params: GetUsersParams = {}) {
  const { data } = await httpClient.request<ApiGetUsersResponse>({
    method: "get",
    url: BASE_PATH,
    params
  });

  return data;
}

export type GetUserByIdParams = Omit<ApiGetUserQuery, "id">;
export type GetUserByIdReturn = Awaited<ReturnType<typeof getUserById>>;

export async function getUserById(id: string, params: GetUserByIdParams = {}) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetUserResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}

export async function updateUserById(id, changes) {
  const { data } = await httpClient.request({
    method: "patch",
    url: `${BASE_PATH}/${id}`,
    data: changes,
  });

  return data;
}

export async function deleteUserById(id) {
  const { data } = await httpClient.request({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}