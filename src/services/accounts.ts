import { ApiGetAccountsQuery, ApiGetAccountsResponse } from "@/pages/api/accounts";
import { ApiGetUserAccountsQuery, ApiGetUserAccountsResponse } from "@/pages/api/user/accounts";
import { ApiDeleteUserAccountByIdResponse, ApiPatchUserAccountByIdBody, ApiPatchUserAccountByIdResponse } from "@/pages/api/user/accounts/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/user/accounts";


export type GetAccountsParams = ApiGetAccountsQuery;
export type GetAccountsReturn = ReturnType<typeof getAccounts>;

export async function getAccounts(params: GetAccountsParams) {
  const { data } = await httpClient.request<ApiGetAccountsResponse>({
    method: "get",
    url: "api/accounts",
    params,
  });

  return data;
}


export type GetUserAccountsParams = ApiGetUserAccountsQuery;
export type GetUserAccountsReturn = ReturnType<typeof getUserAccounts>;

export async function getUserAccounts(params: GetUserAccountsParams = {}) {
  const { data } = await httpClient.request<ApiGetUserAccountsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}


export type UpdateUserAccountByIdData = ApiPatchUserAccountByIdBody;
export type UpdateUserAccountByIdReturn = ReturnType<typeof updateUserAccountById>;

export async function updateUserAccountById(id: string, data: UpdateUserAccountByIdData) {
  const res = await httpClient.request<ApiPatchUserAccountByIdResponse>({
    method: "patch",
    url: `${BASE_PATH}/${id}`,
    data,
  });

  return res.data;
}


export type DeleteUserAccountByIdReturn = ReturnType<typeof deleteUserAccountById>;

export async function deleteUserAccountById(id: string) {
  const { data } = await httpClient.request<ApiDeleteUserAccountByIdResponse>({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}