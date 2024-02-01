import { AxiosError } from "axios";
import { useQuery } from "react-query";

import { getUserCustomer, GetUserCustomerReturn } from "@/services/customers";

const BASE_KEY = "customers";


export type UseGetUserCustomerOptions<TSelect> = {
  enabled?: boolean,
  select?: (data: Awaited<GetUserCustomerReturn> | null) => TSelect,
};

export function useGetUserCustomer<TSelect = Awaited<GetUserCustomerReturn> | null>(options: UseGetUserCustomerOptions<TSelect> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      try {
        const data = await getUserCustomer();
        return data;
      }
      catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return null;
          throw err.response?.data;
        }
        throw err;
      }
    },
    ...options,
  });
}