import { useQuery } from "react-query";

import { getProductById, getProducts } from "@/shared/services/products";

const BASE_KEY = "products";


export function useGetProducts(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getProducts(),
    ...options,
  });
}

export function useGetProductById(id, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getProductById(id),
    ...options,
  });
}