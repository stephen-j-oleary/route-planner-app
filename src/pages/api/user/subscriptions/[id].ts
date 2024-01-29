import { array, boolean, date, InferType, number, object } from "yup";
import { string } from "yup";

import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import compareMongoIds from "@/utils/compareMongoIds";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();


const ApiGetUserSubscriptionByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiGetUserSubscriptionByIdQuery = InferType<typeof ApiGetUserSubscriptionByIdSchema>["query"];
export type ApiGetUserSubscriptionByIdResponse = Awaited<ReturnType<typeof handleGetUserSubscriptionById>>;

export async function handleGetUserSubscriptionById(id: string) {
  return await stripeApiClient.subscriptions.retrieve(id);
}

handler.get(
  authorization({ isCustomer: true }),
  validation(ApiGetUserSubscriptionByIdSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserSubscriptionByIdSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    const subscription = await handleGetUserSubscriptionById(id);
    if (!subscription) throw new NotFoundError();

    const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ForbiddenError();

    res.status(200).json(subscription satisfies NonNullable<ApiGetUserSubscriptionByIdResponse>);
  }
);


const ApiPatchUserSubscriptionByIdSchema = object({
  query: object({
    id: string().required(),
  }),
  body: object({
    items: array(object({
      id: string().optional(),
      deleted: boolean().optional(),
      plan: string().optional(),
      price: string().optional(),
      quantity: number().optional(),
    })),
    cancel_at: date().optional(),
    cancel_at_period_end: boolean().optional(),
    default_payment_method: string().optional(),
  }),
});
export type ApiPatchUserSubscriptionByIdQuery = InferType<typeof ApiPatchUserSubscriptionByIdSchema>["query"];
export type ApiPatchUserSubscriptionByIdBody = InferType<typeof ApiPatchUserSubscriptionByIdSchema>["body"];
export type ApiPatchUserSubscriptionByIdResponse = Awaited<ReturnType<typeof handlePatchUserSubscriptionById>>;

export async function handlePatchUserSubscriptionById(id: string, { cancel_at, ...body }: ApiPatchUserSubscriptionByIdBody) {
  return await stripeApiClient.subscriptions.update(id, {
    ...body,
    cancel_at: cancel_at?.valueOf(),
  });
}

handler.patch(
  authorization({ isSubscriber: true }),
  validation(ApiPatchUserSubscriptionByIdSchema),
  async (req, res) => {
    const { query, body } = req.locals.validated as ValidatedType<typeof ApiPatchUserSubscriptionByIdSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    const subscription = await handleGetUserSubscriptionById(id);
    if (!subscription) throw new NotFoundError();

    const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ForbiddenError();

    const updatedSubscription = await handlePatchUserSubscriptionById(id, body);

    res.status(200).json(updatedSubscription satisfies NonNullable<ApiPatchUserSubscriptionByIdResponse>);
  }
);


const ApiDeleteUserSubscriptionById = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiDeleteUserSubscriptionByIdQuery = InferType<typeof ApiDeleteUserSubscriptionById>["query"];
export type ApiDeleteUserSubscriptionByIdResponse = Awaited<ReturnType<typeof handleDeleteUserSubscriptionById>>;

export async function handleDeleteUserSubscriptionById(id: string) {
  await stripeApiClient.subscriptions.cancel(id);
}

handler.delete(
  authorization({ isSubscriber: true }),
  validation(ApiDeleteUserSubscriptionById),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiDeleteUserSubscriptionById>;
    const { customerId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    const subscription = await handleGetUserSubscriptionById(id);
    if (!subscription) throw new NotFoundError();

    const subscriptionCustomerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    if (!compareMongoIds(customerId, subscriptionCustomerId)) throw new ForbiddenError();

    await handleDeleteUserSubscriptionById(id);

    res.status(204).end();
  }
);


export default handler;