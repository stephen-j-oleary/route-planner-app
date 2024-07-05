import "client-only";

import { ApiGetAutocompleteQuery, ApiGetAutocompleteResponse } from "@/app/api/autocomplete/handlers";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function getAutocomplete(params: ApiGetAutocompleteQuery) {
  return await fetchJson<ApiGetAutocompleteResponse>(
    pages.api.autocomplete,
    {
      method: "GET",
      query: params,
    },
  );
}