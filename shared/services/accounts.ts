import { ApiGetAccountsResponse } from "@/pages/api/accounts";
import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/accounts";


export type GetAccountsReturn = ReturnType<typeof getAccounts>;

export async function getAccounts(params = {}) {
  const { data } = await httpClient.request<ApiGetAccountsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export async function getAccountsProviders(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/providers`,
    params,
  });

  return data;
}

export async function updateAccountCredentialsById(id, changes) {
  const { data } = await httpClient.request({
    method: "patch",
    url: `${BASE_PATH}/${id}/credentials`,
    data: changes,
  });

  return data;
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