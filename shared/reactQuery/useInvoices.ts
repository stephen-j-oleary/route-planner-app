import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "react-query";
import Stripe from "stripe";

import { createUpcomingInvoice, CreateUpcomingInvoiceData, getInvoices, getUpcomingInvoice, GetUpcomingInvoiceParams } from "@/shared/services/invoices";

const BASE_KEY = "invoices";
const UPCOMING_BASE_KEY = "upcomingInvoices";


export type UseGetInvoicesOptions = Omit<UseQueryOptions<Stripe.Invoice[]>, "queryKey" | "queryFn">

export function useGetInvoices(options: UseGetInvoicesOptions = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getInvoices(),
    ...options,
  });
}

export type UseGetUpcomingInvoiceOptions = Omit<UseQueryOptions<Stripe.UpcomingInvoice>, "queryKey" | "queryFn">;

export function useGetUpcomingInvoice(filter: GetUpcomingInvoiceParams, options: UseGetUpcomingInvoiceOptions = {}) {
  return useQuery({
    queryKey: [UPCOMING_BASE_KEY, filter],
    queryFn: () => getUpcomingInvoice(filter),
    ...options,
  });
}

export function useCreateUpcomingInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUpcomingInvoiceData) => createUpcomingInvoice(data),
    onSuccess: () => void queryClient.invalidateQueries([UPCOMING_BASE_KEY]),
  });
}