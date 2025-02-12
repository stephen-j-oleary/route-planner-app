"use server";

import { ApiError } from "next/dist/server/api-utils";

import { ApiGetUserUpcomingInvoiceQuery, ApiPostUserUpcomingInvoiceBody } from "./schemas";
import pages from "@/pages";
import auth from "@/utils/auth";
import stripeClientNext from "@/utils/stripeClient/next";


export async function getUserUpcomingInvoice(query: ApiGetUserUpcomingInvoiceQuery & { customer: string }) {
  const { customer: { id: customerId } = {} } = await auth(pages.api.userInvoices).api();

  const invoice = await stripeClientNext.invoices.retrieveUpcoming(query);
  if (!invoice || invoice.customer !== customerId) throw new ApiError(404, "Invoice not found");

  return invoice;
}


export async function postUserUpcomingInvoice({ subscription_cancel_at, subscription_proration_date, ...params }: ApiPostUserUpcomingInvoiceBody = {}) {
  const { customer: { id: customerId } = {} } = await auth(pages.api.userInvoices).api();

  const invoice = await stripeClientNext.invoices.retrieveUpcoming({
    customer: customerId,
    subscription_cancel_at: subscription_cancel_at && Math.round(subscription_cancel_at.valueOf() / 1000), // Round to integer of seconds; The value passed to Stripe must be a whole integer
    subscription_proration_date: subscription_proration_date && Math.round(subscription_proration_date.valueOf() / 1000), // Round to integer of seconds; The value passed to Stripe must be a whole integer
    ...params,
  });
  if (!invoice) throw new ApiError(500, "Resource not created");

  return invoice;
}