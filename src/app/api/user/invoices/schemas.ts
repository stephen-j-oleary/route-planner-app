import { array, date, InferType, object, string } from "yup";

import { getUserInvoices } from "./actions";


export const ApiGetUserInvoicesQuerySchema = object()
  .shape({
    due_date: date().optional(),
    expand: array(string().required()).optional(),
    status: string().oneOf(["draft", "open", "paid", "uncollectible", "void"]).optional(),
    subscription: string().optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserInvoicesQuery = InferType<typeof ApiGetUserInvoicesQuerySchema>;
export type ApiGetUserInvoicesResponse = Awaited<ReturnType<typeof getUserInvoices>>;