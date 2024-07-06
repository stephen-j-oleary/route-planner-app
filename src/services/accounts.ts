import "client-only";

import { ApiGetAccountsQuery, ApiGetAccountsResponse } from "@/app/api/accounts/handlers";
import { ApiDeleteUserAccountByIdResponse, ApiPatchUserAccountByIdBody, ApiPatchUserAccountByIdResponse } from "@/app/api/user/accounts/[id]/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getAccounts(params: ApiGetAccountsQuery) {
  return await fetchJson<ApiGetAccountsResponse>(
    pages.api.accounts,
    {
      method: "GET",
      query: params,
    },
  );
}


export async function updateUserAccountById(id: string, update: ApiPatchUserAccountByIdBody) {
  const data = await fetchJson<ApiPatchUserAccountByIdResponse>(
    `${pages.api.userAccounts}/${id}`,
    {
      method: "PATCH",
      data: update,
    },
  );

  return data;
}


export async function deleteUserAccountById(id: string) {
  const data = await fetchJson<ApiDeleteUserAccountByIdResponse>(
    `${pages.api.userAccounts}/${id}`,
    { method: "DELETE" },
  );

  return data;
}