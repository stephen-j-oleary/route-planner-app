import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { createUserUpcomingInvoice, getUserInvoices, GetUserInvoicesParams, GetUserInvoicesReturn, getUserUpcomingInvoice, GetUserUpcomingInvoiceParams, GetUserUpcomingInvoiceReturn } from "@/services/invoices";

const BASE_KEY = "invoices";
const UPCOMING_BASE_KEY = "upcomingInvoices";


export type UseGetUserInvoicesOptions<TSelected> = {
  params?: GetUserInvoicesParams,
  enabled?: boolean,
  select?: (data: Awaited<GetUserInvoicesReturn>) => TSelected,
};

export function useGetUserInvoices<TSelected = Awaited<GetUserInvoicesReturn>>({ params = {}, ...options }: UseGetUserInvoicesOptions<TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: async () => {
      try {
        const data = await getUserInvoices(params);
        return data;
      }
      catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) return [];
          throw err.response?.data;
        }
        throw err;
      }
    },
    ...options,
  });
}


export type UseGetUserUpcomingInvoiceOptions<TData, TSelected> = {
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetUserUpcomingInvoice<TData = Awaited<GetUserUpcomingInvoiceReturn>, TSelected = TData>(params: GetUserUpcomingInvoiceParams, options: UseGetUserUpcomingInvoiceOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [UPCOMING_BASE_KEY, params],
    queryFn: () => getUserUpcomingInvoice(params) as TData,
    ...options,
  });
}


export function useCreateUserUpcomingInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserUpcomingInvoice,
    onSuccess: () => void queryClient.invalidateQueries([UPCOMING_BASE_KEY]),
  });
}