import { array, InferType, object, string } from "yup";

import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();


const ApiGetUserPaymentMethodsSchema = object({
  query: object({
    expnad: array(string().required()).optional(),
  }),
});
export type ApiGetUserPaymentMethodsQuery = InferType<typeof ApiGetUserPaymentMethodsSchema>["query"];
export type ApiGetUserPaymentMethodsResponse = Awaited<ReturnType<typeof handleGetUserPaymentMethods>>;
export async function handleGetUserPaymentMethods(query: ApiGetUserPaymentMethodsQuery & { customer: string }) {
  const { data } = await stripeApiClient.paymentMethods.list(query);
  return data;
}

handler.get(
  authorization({ isCustomer: true }),
  validation(ApiGetUserPaymentMethodsSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserPaymentMethodsSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;

    const data = await handleGetUserPaymentMethods({ ...query, customer: customerId! });

    res.status(200).json(data satisfies NonNullable<ApiGetUserPaymentMethodsResponse>);
  }
);

export default handler;