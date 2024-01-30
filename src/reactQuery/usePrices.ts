import { useQuery } from "react-query";

import { getPriceById, GetPriceByIdParams, GetPriceByIdReturn, getPrices, GetPricesParams, GetPricesReturn } from "@/services/prices";

const BASE_KEY = "prices";


export type UseGetPricesOptions<TData, TSelected> = {
  params?: GetPricesParams,
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetPrices<TData = Awaited<GetPricesReturn>, TSelected = TData>({ params = {}, ...options }: UseGetPricesOptions<TData, TSelected> = {}) {
  return useQuery({
    ...options,
    queryKey: [BASE_KEY, params],
    queryFn: () => getPrices(params) as TData,
  });
}


export type UseGetPriceByIdOptions<TData, TSelected> = {
  params?: GetPriceByIdParams,
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetPriceById<TData = Awaited<GetPriceByIdReturn>, TSelected = TData>(id: string | undefined, { enabled = true, params = {}, ...options }: UseGetPriceByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id, params }],
    queryFn: () => getPriceById(id, params) as TData,
    enabled: !!id && enabled,
    ...options,
  });
}