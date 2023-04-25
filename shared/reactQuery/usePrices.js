import { useQuery } from "react-query";

import { getPriceById, getPrices } from "@/shared/services/prices";

const BASE_KEY = "prices";


export function useGetPrices(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getPrices({ expand: "data.tiers" }),
    ...options,
  });
}

export function useGetPriceById(id, options = {}) {
  return useQuery({
    queryKey: [BASE_KEY, { id }],
    queryFn: () => getPriceById(id, { expand: "tiers" }),
    ...options,
  });
}