import "client-only";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";

import { getAutocomplete } from "@/app/api/autocomplete/actions";
import { ApiGetAutocompleteQuery, ApiGetAutocompleteResponse } from "@/app/api/autocomplete/schemas";

const DEBOUNCE_DELAY_MS = 500;


export type AddressSuggestion = {
  fullText: string,
  mainText?: string,
  secondaryText?: string,
  coordinates?: [number, number],
}


export type UseAddressSuggestionsOptions = {
  q?: string,
  params?: Omit<ApiGetAutocompleteQuery, "q">,
  enabled?: boolean,
}

export default function useAddressSuggestions({
  q,
  params = {},
  enabled = false
}: UseAddressSuggestionsOptions) {
  const debouncedQ = useDebounce(q, DEBOUNCE_DELAY_MS);

  return useQuery({
    queryKey: ["autocomplete", debouncedQ],
    queryFn: async () => (debouncedQ ? await getAutocomplete({ q: debouncedQ, ...params }) : []) as ApiGetAutocompleteResponse,
    select: data => data.results || [],
    enabled,
  });
}