import { ApiGetAutocompleteQuery, ApiGetAutocompleteResponse } from "@/pages/api/autocomplete";
import httpClient from "@/utils/httpClient";


export type GetAutocompleteParams = ApiGetAutocompleteQuery;
export type GetAutocompleteReturn = Awaited<ReturnType<typeof getAutocomplete>>;

export async function getAutocomplete(params: GetAutocompleteParams) {
  const { data } = await httpClient.request<ApiGetAutocompleteResponse>({
    method: "get",
    url: "api/autocomplete",
    params,
  });
  return data;
}