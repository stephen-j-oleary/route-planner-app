"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiGetAccountsQuery, ApiGetAccountsResponse } from "@/app/api/accounts/handlers";
import { ApiDeleteUserAccountByIdResponse, ApiPatchUserAccountByIdBody, ApiPatchUserAccountByIdResponse } from "@/app/api/user/accounts/[id]/route";
import { ApiGetUserAccountsQuery, ApiGetUserAccountsResponse } from "@/app/api/user/accounts/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getAccounts(params: ApiGetAccountsQuery) {
  const res = await fetchJson(
    pages.api.accounts,
    {
      method: "GET",
      query: params,
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetAccountsResponse;
}


export async function getUserAccounts(params: ApiGetUserAccountsQuery = {}) {
  const res = await fetchJson(
    pages.api.userAccounts,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetUserAccountsResponse;
}


export async function updateUserAccountById(id: string, update: ApiPatchUserAccountByIdBody) {
  const res = await fetchJson(
    `${pages.api.userAccounts}/${id}`,
    {
      method: "PATCH",
      data: update,
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.userAccounts);

  return data as ApiPatchUserAccountByIdResponse;
}


export async function deleteUserAccountById(id: string) {
  const res = await fetchJson(
    `${pages.api.userAccounts}/${id}`,
    { method: "DELETE" },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  revalidatePath(pages.api.userAccounts);

  return data as ApiDeleteUserAccountByIdResponse;
}