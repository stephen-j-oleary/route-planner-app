"use server";

import { ApiGetUserInvoicesQuery } from "./schemas";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserInvoices({ customer, due_date, ...query }: ApiGetUserInvoicesQuery & { customer?: string }) {
  if (!customer) return [];

  const { data } = await stripeClientNext.invoices.list({
    customer,
    due_date: due_date && due_date.valueOf() / 1000,
    ...query,
  });
  return data;
}