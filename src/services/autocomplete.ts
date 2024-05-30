"use server";

import { cookies } from "next/headers";

import { ApiGetAutocompleteQuery, ApiGetAutocompleteResponse } from "@/app/api/autocomplete/handlers";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getAutocomplete(params: ApiGetAutocompleteQuery) {
  const res = await fetchJson(
    pages.api.autocomplete,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );
  const data = await res.json();

  if (!res.ok) throw data;

  return data as ApiGetAutocompleteResponse;
}