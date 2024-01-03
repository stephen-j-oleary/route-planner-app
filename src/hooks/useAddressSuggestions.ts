import { useDebounce } from "@uidotdev/usehooks";

import { useGetAutocomplete } from "@/reactQuery/useAutocomplete";
import { Coordinates } from "@/types/coordinates";


export type AddressSuggestion = {
  fullText: string,
  mainText?: string,
  secondaryText?: string,
  coordinates?: Coordinates,
}


export type UseAddressSuggestionsOptions = {
  q?: string,
  enabled?: boolean,
}

export function useAddressSuggestions({
  q,
  enabled = false
}: UseAddressSuggestionsOptions) {
  const debouncedQ = useDebounce(q, 1000);

  return useGetAutocomplete({
    q: debouncedQ,
    select: data => data.results || [],
    enabled,
  });
}