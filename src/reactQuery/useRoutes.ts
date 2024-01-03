import { useQuery } from "react-query";

import { getRouteById, GetRouteByIdReturn } from "@/services/routes";

const BASE_KEY = "routes";


export type UseGetRouteByIdOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
}

export function useGetRouteById<TData = Awaited<GetRouteByIdReturn>, TSelected = TData>(id: string | undefined, { enabled = true, ...options }: UseGetRouteByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getRouteById(id),
    enabled: !!id && enabled,
    ...options,
  });
}