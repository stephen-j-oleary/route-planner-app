"use server";

import { ApiError } from "next/dist/server/api-utils";

import { ApiGetUserInvoicesQuery } from "./schemas";
import { getUserCustomer } from "../customer/actions";
import pojo from "@/utils/pojo";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserInvoices({ due_date, ...query }: ApiGetUserInvoicesQuery = {}) {
  const customer = await getUserCustomer();
  if (!customer) throw new ApiError(403, "User not authorized");

  const { data } = await stripeClientNext.invoices.list({
    customer: customer.id,
    due_date: due_date && due_date.valueOf() / 1000,
    ...query,
  });
  return pojo(data);
}