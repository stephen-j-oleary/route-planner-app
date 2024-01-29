import { array, boolean, date, InferType, number, object, string } from "yup";

import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { ApiError, NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();


const ApiGetUserUpcomingInvoiceSchema = object({
  query: object({
    subscription: string().optional(),
  }),
});
export type ApiGetUserUpcomingInvoiceQuery = InferType<typeof ApiGetUserUpcomingInvoiceSchema>["query"];
export type ApiGetUserUpcomingInvoiceResponse = Awaited<ReturnType<typeof handleGetUserUpcomingInvoice>>;

export async function handleGetUserUpcomingInvoice(query: ApiGetUserUpcomingInvoiceQuery & { customer: string }) {
  return await stripeApiClient.invoices.retrieveUpcoming(query);
}

handler.get(
  authorization({ isSubscriber: true }),
  validation(ApiGetUserUpcomingInvoiceSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserUpcomingInvoiceSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;

    const data = await handleGetUserUpcomingInvoice({ ...query, customer: customerId! });
    if (!data) throw new NotFoundError();

    res.status(200).json(data satisfies NonNullable<ApiGetUserUpcomingInvoiceResponse>);
  }
);


const ApiPostUserUpcomingInvoiceSchema = object({
  body: object({
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
  }),
});
export type ApiPostUserUpcomingInvoiceBody = InferType<typeof ApiPostUserUpcomingInvoiceSchema>["body"];
export type ApiPostUserUpcomingInvoiceResponse = Awaited<ReturnType<typeof handlePostUserUpcomingInvoice>>;

export async function handlePostUserUpcomingInvoice({ subscription_cancel_at, subscription_proration_date, ...params }: ApiPostUserUpcomingInvoiceBody & { customer: string }) {
  return await stripeApiClient.invoices.retrieveUpcoming({
    subscription_cancel_at: subscription_cancel_at && subscription_cancel_at.valueOf() / 1000,
    subscription_proration_date: subscription_proration_date && subscription_proration_date.valueOf() / 1000,
    ...params,
  });
}

handler.post(
  authorization({ isSubscriber: true }),
  validation(ApiPostUserUpcomingInvoiceSchema),
  async (req, res) => {
    const { body } = req.locals.validated as ValidatedType<typeof ApiPostUserUpcomingInvoiceSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;

    const data = await handlePostUserUpcomingInvoice({ ...body, customer: customerId! });
    if (!data) throw new ApiError({ status: 500, message: "Resource not created" });

    res.status(201).json(data satisfies NonNullable<ApiPostUserUpcomingInvoiceResponse>);
  }
);

export default handler;