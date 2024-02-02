import { InferType, object, string } from "yup";
import { array } from "yup";

import nextConnect from "@/nextConnect";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { NotFoundError } from "@/utils/ApiErrors";
import stripeClientNext from "@/utils/stripeClient/next";


const handler = nextConnect();


const ApiGetPriceByIdSchema = object({
  query: object({
    id: string().required(),
    expand: array(string().required()).optional(),
  })
});
export type ApiGetPriceByIdQuery = Omit<InferType<typeof ApiGetPriceByIdSchema>["query"], "id">;
export type ApiGetPriceByIdResponse = Awaited<ReturnType<typeof handleGetPriceById>>;

export async function handleGetPriceById(id: string, params: ApiGetPriceByIdQuery = {}) {
  return await stripeClientNext.prices.retrieve(id, params);
}

handler.get(
  validation(ApiGetPriceByIdSchema),
  async (req, res) => {
    const { query: { id, ...query } } = req.locals.validated as ValidatedType<typeof ApiGetPriceByIdSchema>;

    const data = await handleGetPriceById(id, query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data satisfies NonNullable<ApiGetPriceByIdResponse>);
  }
);


export default handler;