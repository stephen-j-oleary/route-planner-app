import { ApiGetUserResponse, ApiPatchUserBody, ApiPatchUserResponse } from "@/pages/api/user";
import { ApiGetUsersQuery, ApiGetUsersResponse } from "@/pages/api/users";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/user";


export type GetUsersParams = ApiGetUsersQuery;
export type GetUsersReturn = Awaited<ReturnType<typeof getUsers>>;

export async function getUsers(params: GetUsersParams) {
  const { data } = await httpClient.request<ApiGetUsersResponse>({
    method: "get",
    url: "api/users",
    params
  });

  return data;
}

export type GetUserReturn = Awaited<ReturnType<typeof getUser>>;
export async function getUser() {
  const { data } = await httpClient.request<ApiGetUserResponse>({
    method: "get",
    url: BASE_PATH,
  });

  return data;
}

export type UpdateUserData = ApiPatchUserBody;
export type UpdateUserReturn = Awaited<ReturnType<typeof updateUser>>;
export async function updateUser(data: UpdateUserData) {
  const res = await httpClient.request<ApiPatchUserResponse>({
    method: "patch",
    url: BASE_PATH,
    data,
  });

  return res.data;
}


export async function deleteUser() {
  await httpClient.request({
    method: "delete",
    url: BASE_PATH,
  });

  return;
}