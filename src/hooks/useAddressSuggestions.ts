import { useDebounce } from "@uidotdev/usehooks";

import { useGetAutocomplete } from "@/reactQuery/useAutocomplete";
import { GetAutocompleteParams } from "@/services/autocomplete";

const DEBOUNCE_DELAY_MS = 500;


export type AddressSuggestion = {
  fullText: string,
  mainText?: string,
  secondaryText?: string,
  coordinates?: [number, number],
}


export type UseAddressSuggestionsOptions = {
  q?: string,
  params?: Omit<GetAutocompleteParams, "q">,
  enabled?: boolean,
}

export function useAddressSuggestions({
  q,
  params = {},
  enabled = false
}: UseAddressSuggestionsOptions) {
  const debouncedQ = useDebounce(q, DEBOUNCE_DELAY_MS);

  return useGetAutocomplete({
    q: debouncedQ,
    params,
    select: data => data.results || [],
    enabled,
  });
}