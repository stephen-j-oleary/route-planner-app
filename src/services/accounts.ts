import { ApiGetAccountsQuery, ApiGetAccountsResponse } from "@/pages/api/accounts";
import { ApiPatchAccountCredentialsBody, ApiPatchAccountCredentialsQuery, ApiPatchAccountCredentialsResponse } from "@/pages/api/accounts/[id]/credentials";
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

export type UpdateAccountCredentialsByIdData = ApiPatchAccountCredentialsBody;
export type UpdateAccountCredentialsByIdReturn = Awaited<ReturnType<typeof updateAccountCredentialsById>>;

export async function updateAccountCredentialsById(id: ApiPatchAccountCredentialsQuery["id"], data: UpdateAccountCredentialsByIdData) {
  const res = await httpClient.request<ApiPatchAccountCredentialsResponse>({
    method: "patch",
    url: `${BASE_PATH}/${id}/credentials`,
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