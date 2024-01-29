import { useQuery } from "react-query";

import { getProductById, GetProductByIdReturn, getProducts, GetProductsReturn } from "@/services/products";

const BASE_KEY = "products";


export type UseGetProductsOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetProducts<TData = Awaited<GetProductsReturn>, TSelected = TData>(options: UseGetProductsOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getProducts() as TData,
    ...options,
  });
}

export type UseGetProductByIdOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetProductById<TData = Awaited<GetProductByIdReturn>, TSelected = TData>(id: string, { enabled = true, ...options }: UseGetProductByIdOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, id],
    queryFn: () => getProductById(id) as TData,
    enabled: !!id && enabled,
    ...options,
  });
}