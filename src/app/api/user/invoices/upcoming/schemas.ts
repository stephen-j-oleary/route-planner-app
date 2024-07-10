import { array, boolean, date, InferType, number, object, string } from "yup";

import { getUserUpcomingInvoice, postUserUpcomingInvoice } from "./actions";


export const ApiGetUserUpcomingInvoiceQuerySchema = object()
  .shape({
    subscription: string().optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserUpcomingInvoiceQuery = InferType<typeof ApiGetUserUpcomingInvoiceQuerySchema>;
export type ApiGetUserUpcomingInvoiceResponse = Awaited<ReturnType<typeof getUserUpcomingInvoice>>;


export const ApiPostUserUpcomingInvoiceBodySchema = object()
  .shape({
    expand: array(string().required()).optional(),
    subscription: string().optional(),
    subscription_cancel_at: date().optional(),
    subscription_proration_date: date().optional(),
    subscription_cancel_at_period_end: boolean().optional(),
    subscription_cancel_now: boolean().optional(),
    subscription_items: array(object({
      id: string().optional(),
      deleted: boolean().optional(),
      plan: string().optional(),
      price: string().optional(),
      quantity: number().optional(),
    })).optional(),
  })
  .optional()
  .noUnknown();
export type ApiPostUserUpcomingInvoiceBody = InferType<typeof ApiPostUserUpcomingInvoiceBodySchema>;
export type ApiPostUserUpcomingInvoiceResponse = Awaited<ReturnType<typeof postUserUpcomingInvoice>>;