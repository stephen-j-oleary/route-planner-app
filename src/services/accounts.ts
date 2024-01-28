import { ApiGetAccountsQuery, ApiGetAccountsResponse } from "@/pages/api/accounts";
import { ApiPatchAccountBody, ApiPatchAccountQuery, ApiPatchAccountResponse } from "@/pages/api/accounts/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/accounts";


export type GetAccountsParams = ApiGetAccountsQuery;
export type GetAccountsReturn = ReturnType<typeof getAccounts>;

export async function getAccounts(params: GetAccountsParams = {}) {
  const { data } = await httpClient.request<ApiGetAccountsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export type UpdateAccountByIdData = ApiPatchAccountBody;
export type UpdateAccountByIdReturn = Awaited<ReturnType<typeof updateAccountById>>;

export async function updateAccountById(id: ApiPatchAccountQuery["id"], data: UpdateAccountByIdData) {
  const res = await httpClient.request<ApiPatchAccountResponse>({
    method: "patch",
    url: `${BASE_PATH}/${id}`,
    data,
  });

  return res.data;
}

export async function deleteAccountById(id) {
  const { data } = await httpClient.request({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}

export async function deleteAccountByUser(userId) {
  const { data } = await httpClient.request({
    method: "delete",
    url: BASE_PATH,
    params: { userId },
  });

  return data;
}