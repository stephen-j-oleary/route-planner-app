import { useQuery } from "react-query";

import { getAutocomplete, GetAutocompleteReturn } from "@/services/autocomplete";

export const QUERY_KEY = "autocomplete";


export type UseGetAutocompleteOptions<TData, TSelected> = {
  q: string | undefined,
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};
export function useGetAutocomplete<TData = Awaited<GetAutocompleteReturn>, TSelected = TData>({ q, ...options }: UseGetAutocompleteOptions<TData, TSelected>) {
  return useQuery({
    queryKey: [QUERY_KEY, q],
    queryFn: () => (q ? getAutocomplete({ q }) : []) as TData,
    keepPreviousData: true,
    ...options,
  });
}