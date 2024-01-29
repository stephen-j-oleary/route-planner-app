import { object } from "yup";
import { string } from "yup";

import nextConnect from "@/nextConnect";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();


const ApiGetProductByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiGetProductByIdResponse = Awaited<ReturnType<typeof handleGetProductById>>;

export async function handleGetProductById(id: string) {
  return await stripeApiClient.products.retrieve(id);
}

handler.get(
  validation(ApiGetProductByIdSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetProductByIdSchema>;
    const { id } = query;

    const product = await handleGetProductById(id);
    if (!product) throw new NotFoundError();

    res.status(200).json(product satisfies NonNullable<ApiGetProductByIdResponse>);
  }
);


export default handler;