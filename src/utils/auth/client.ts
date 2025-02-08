import "client-only";

import { AuthData } from "./utils";
import pages from "@/pages";
import fetchJson from "@/utils/fetchJson";
import { toAbsolute } from "@/utils/url";


export async function signIn() {
  return await fetchJson<AuthData>(
    toAbsolute(pages.api.session),
    { method: "PATCH" },
  );
}

export async function getSession() {
  return await fetchJson<AuthData>(
    toAbsolute(pages.api.session),
    { method: "GET" },
  );
}