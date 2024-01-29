import { InferType, object, string } from "yup";
import { array } from "yup";

import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();


const ApiGetUserSubscriptionsSchema = object({
  query: object({
    expand: array(string().required()).optional(),
    plan: string().optional(),
    price: string().optional(),
  }),
});
export type ApiGetUserSubscriptionsQuery = InferType<typeof ApiGetUserSubscriptionsSchema>["query"];
export type ApiGetUserSubscriptionsResponse = Awaited<ReturnType<typeof handleGetUserSubscriptions>>;

export async function handleGetUserSubscriptions(query: ApiGetUserSubscriptionsQuery & { customer: string }) {
  const { data } = await stripeApiClient.subscriptions.list(query);
  return data;
}

handler.get(
  authorization({ isCustomer: true }),
  validation(ApiGetUserSubscriptionsSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserSubscriptionsSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;

    const data = await handleGetUserSubscriptions({ ...query, customer: customerId! });

    res.status(200).json(data satisfies NonNullable<ApiGetUserSubscriptionsResponse>);
  }
);


export default handler;