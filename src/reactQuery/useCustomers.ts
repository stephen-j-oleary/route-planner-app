import { useQuery } from "react-query";

import { getCustomerById, GetCustomerByIdReturn } from "../services/customers";

const BASE_KEY = "customers";


export type UseGetCustomerByIdOptions<TData, TSelect> = {
  enabled?: boolean,
  select?: (data: TData) => TSelect,
};

export function useGetCustomerById<TData = Awaited<GetCustomerByIdReturn>, TSelect = TData>(id?: string, { enabled = true, ...options }: UseGetCustomerByIdOptions<TData, TSelect> = {}) {
  return useQuery({
    queryKey: [BASE_KEY, id],
    queryFn: () => getCustomerById(id) as TData,
    enabled: enabled && !!id,
    ...options,
  });
}