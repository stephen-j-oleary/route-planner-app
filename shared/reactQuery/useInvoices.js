import { useQuery } from "react-query";

import { createUpcomingInvoice, getInvoices, getUpcomingInvoice } from "@/shared/services/invoices";

const BASE_KEY = "invoices";
const UPCOMING_BASE_KEY = "upcomingInvoices";


export function useGetInvoices(options = {}) {
  return useQuery({
    queryKey: [BASE_KEY],
    queryFn: () => getInvoices(),
    ...options,
  });
}

export function useGetUpcomingInvoice(filter, options = {}) {
  return useQuery({
    queryKey: [UPCOMING_BASE_KEY, filter],
    queryFn: () => getUpcomingInvoice(filter),
    ...options,
  });
}

export function useCreateUpcomingInvoice(data, options = {}) {
  return useQuery({
    queryKey: [UPCOMING_BASE_KEY, data],
    queryFn: () => createUpcomingInvoice(data),
    ...options,
  });
}