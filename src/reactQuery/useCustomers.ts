import { useQuery } from "react-query";

import { getUserCustomer, GetUserCustomerReturn } from "@/services/customers";

const BASE_KEY = "customers";


export type UseGetUserCustomerOptions<TData, TSelect> = {
  enabled?: boolean,
  select?: (data: TData) => TSelect,
};

export function useGetUserCustomer<TData = Awaited<GetUserCustomerReturn>, TSelect = TData>(options: UseGetUserCustomerOptions<TData, TSelect> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getUserCustomer() as TData,
    ...options,
  });
}