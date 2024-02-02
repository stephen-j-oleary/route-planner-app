import { array, boolean, InferType, object, string } from "yup";

import nextConnect from "@/nextConnect";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { NotFoundError } from "@/utils/ApiErrors";
import stripeClientNext from "@/utils/stripeClient/next";


const handler = nextConnect();


const ApiGetPricesSchema = object({
  query: object({
    active: boolean().optional(),
    product: string().optional(),
    expand: array(string().required()).optional(),
    lookup_keys: array(string().required()).optional(),
  }),
});
export type ApiGetPricesQuery = InferType<typeof ApiGetPricesSchema>["query"];
export type ApiGetPricesResponse = Awaited<ReturnType<typeof handleGetPrices>>;

export async function handleGetPrices(query: ApiGetPricesQuery) {
  const { data } = await stripeClientNext.prices.list(query);
  return data;
}

handler.get(
  validation(ApiGetPricesSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetPricesSchema>;

    const data = await handleGetPrices(query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data satisfies NonNullable<ApiGetPricesResponse>);
  }
);


export default handler;