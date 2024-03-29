import { array, date, InferType, object, string } from "yup";

import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import stripeClientNext from "@/utils/stripeClient/next";


const handler = nextConnect();


const ApiGetUserInvoicesSchema = object({
  query: object({
    due_date: date().optional(),
    expand: array(string().required()).optional(),
    status: string().oneOf(["draft", "open", "paid", "uncollectible", "void"]).optional(),
    subscription: string().optional(),
  }),
});
export type ApiGetUserInvoicesQuery = InferType<typeof ApiGetUserInvoicesSchema>["query"];
export type ApiGetUserInvoicesResponse = Awaited<ReturnType<typeof handleGetUserInvoices>>;

export async function handleGetUserInvoices({ customer, due_date, ...query }: ApiGetUserInvoicesQuery & { customer?: string }) {
  if (!customer) return [];

  const { data } = await stripeClientNext.invoices.list({
    customer,
    due_date: due_date && due_date.valueOf() / 1000,
    ...query,
  });
  return data;
}

handler.get(
  authorization({ isUser: true }),
  validation(ApiGetUserInvoicesSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserInvoicesSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;

    const data = await handleGetUserInvoices({ ...query, customer: customerId });

    res.status(200).json(data satisfies NonNullable<ApiGetUserInvoicesResponse>);
  }
);

export default handler;