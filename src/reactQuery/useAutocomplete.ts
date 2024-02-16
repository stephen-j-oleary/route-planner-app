import { useQuery } from "react-query";

import { getAutocomplete, GetAutocompleteParams, GetAutocompleteReturn } from "@/services/autocomplete";

export const QUERY_KEY = "autocomplete";


export type UseGetAutocompleteOptions<TData, TSelected> = {
  q: string | undefined,
  params?: Omit<GetAutocompleteParams, "q">,
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};
export function useGetAutocomplete<TData = Awaited<GetAutocompleteReturn>, TSelected = TData>({ q, params = {}, ...options }: UseGetAutocompleteOptions<TData, TSelected>) {
  return useQuery({
    queryKey: [QUERY_KEY, q],
    queryFn: () => (q ? getAutocomplete({ q, ...params }) : []) as TData,
    keepPreviousData: true,
    ...options,
  });
}