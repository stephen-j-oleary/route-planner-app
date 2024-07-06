import "client-only";

import { AuthData, SignInAccountData } from ".";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function signIn(accountData: SignInAccountData) {
  const data = await fetchJson<AuthData>(
    pages.api.signin,
    {
      method: "POST",
      data: accountData,
    },
  );

  return data;
}


export async function signOut() {
  await fetchJson(
    pages.api.session,
    { method: "DELETE" },
  );

  return;
}


export async function getSession() {
  return await fetchJson<AuthData>(
    pages.api.session,
    {
      method: "GET",
      credentials: "include",
    },
  );
}