import { useMutation, useQuery, useQueryClient } from "react-query";

import { createUserUpcomingInvoice, getUserInvoices, GetUserInvoicesParams, GetUserInvoicesReturn, getUserUpcomingInvoice, GetUserUpcomingInvoiceParams, GetUserUpcomingInvoiceReturn } from "@/services/invoices";

const BASE_KEY = "invoices";
const UPCOMING_BASE_KEY = "upcomingInvoices";


export type UseGetUserInvoicesOptions<TData, TSelected> = {
  params?: GetUserInvoicesParams,
  enabled?: boolean,
  select?: (data: TData) => TSelected,
};

export function useGetUserInvoices<TData = Awaited<GetUserInvoicesReturn>, TSelected = TData>({ params = {}, ...options }: UseGetUserInvoicesOptions<TData, TSelected> = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getUserInvoices(params) as TData,
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