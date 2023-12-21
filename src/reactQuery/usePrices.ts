import { useQuery } from "react-query";

import { getPriceById, GetPriceByIdParams, GetPriceByIdReturn, getPrices, GetPricesParams, GetPricesReturn } from "@/services/prices";

const BASE_KEY = "prices";


export type UseGetPricesOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
  params?: GetPricesParams,
}
export function useGetPrices<TData = Awaited<GetPricesReturn>, TSelected = TData>({ params = {}, ...options }: UseGetPricesOptions<TData, TSelected> = {}) {
  return useQuery({
    ...options,
    queryKey: [BASE_KEY, params],
    queryFn: () => getPrices(params) as TData,
  });
}

export type UseGetPriceByIdOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
  params?: GetPriceByIdParams,
};
export function useGetPriceById<TData = Awaited<GetPriceByIdReturn>, TSelected = TData>(id: string, { enabled = true, params = {}, ...options }: UseGetPriceByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id, ...params }],
    queryFn: () => getPriceById(id, params) as TData,
    enabled: enabled && !!id,
    ...options,
  });
}