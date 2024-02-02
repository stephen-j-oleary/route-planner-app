import { array, InferType, object, string } from "yup";

import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import stripeClientNext from "@/utils/stripeClient/next";


const handler = nextConnect();


const ApiGetUserPaymentMethodByIdSchema = object({
  query: object({
    id: string().required(),
    expand: array(string().required()).optional(),
  }),
});
export type ApiGetUserPaymentMethodByIdQuery = Omit<InferType<typeof ApiGetUserPaymentMethodByIdSchema>["query"], "id">;
export type ApiGetUserPaymentMethodByIdResponse = Awaited<ReturnType<typeof handleGetUserPaymentMethodById>>;

export async function handleGetUserPaymentMethodById(id: string, query: Omit<ApiGetUserPaymentMethodByIdQuery, "id"> = {}) {
  return await stripeClientNext.paymentMethods.retrieve(id, query);
}

handler.get(
  authorization({ isCustomer: true }),
  validation(ApiGetUserPaymentMethodByIdSchema),
  async (req, res) => {
    const { query: { id, ...query } } = req.locals.validated as ValidatedType<typeof ApiGetUserPaymentMethodByIdSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;

    const paymentMethod = await handleGetUserPaymentMethodById(id, query);
    if (!paymentMethod) throw new NotFoundError();

    if (paymentMethod.customer !== customerId) throw new ForbiddenError();

    res.status(200).json(paymentMethod satisfies NonNullable<ApiGetUserPaymentMethodByIdResponse>);
  }
);


const ApiDeleteUserPaymentMethodByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiDeleteUserPaymentMethodByIdResponse = Awaited<ReturnType<typeof handleDeleteUserPaymentMethodById>>;

export async function handleDeleteUserPaymentMethodById(id: string) {
  return await stripeClientNext.paymentMethods.detach(id);
}

handler.delete(
  authorization({ isCustomer: true }),
  validation(ApiDeleteUserPaymentMethodByIdSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiDeleteUserPaymentMethodByIdSchema>;
    const { customerId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    const paymentMethod = await handleGetUserPaymentMethodById(id);
    if (!paymentMethod) throw new NotFoundError();

    if (paymentMethod.customer !== customerId) throw new ForbiddenError();

    const deletedPaymentMethod = await handleDeleteUserPaymentMethodById(id);
    if (!deletedPaymentMethod) throw new NotFoundError();

    res.status(204).end();
  }
);

export default handler;