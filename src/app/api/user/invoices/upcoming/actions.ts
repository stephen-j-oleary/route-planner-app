"use server";

import { ApiError } from "next/dist/server/api-utils";
import { cookies } from "next/headers";

import { ApiGetUserUpcomingInvoiceQuery, ApiPostUserUpcomingInvoiceBody } from "./schemas";
import { auth } from "@/utils/auth";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserUpcomingInvoice(query: ApiGetUserUpcomingInvoiceQuery & { customer: string }) {
  const invoice = await stripeClientNext.invoices.retrieveUpcoming(query);
  if (!invoice) throw new ApiError(404, "Invoice not found");

  return invoice;
}


export async function postUserUpcomingInvoice({ subscription_cancel_at, subscription_proration_date, ...params }: ApiPostUserUpcomingInvoiceBody = {}) {
  const { customerId } = await auth(cookies());

  const invoice = await stripeClientNext.invoices.retrieveUpcoming({
    customer: customerId,
    subscription_cancel_at: subscription_cancel_at && subscription_cancel_at.valueOf() / 1000,
    subscription_proration_date: subscription_proration_date && subscription_proration_date.valueOf() / 1000,
    ...params,
  });
  if (!invoice) throw new ApiError(500, "Resource not created");

  return invoice;
}