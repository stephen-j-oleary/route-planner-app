import { array, boolean, InferType, object, string } from "yup";

import nextConnect from "@/nextConnect";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import stripeClientNext from "@/utils/stripeClient/next";


const handler = nextConnect();


const ApiGetProductsSchema = object({
  query: object({
    active: boolean().optional(),
    expand: array(string().required()).optional(),
  })
})
export type ApiGetProductsQuery = InferType<typeof ApiGetProductsSchema>["query"];
export type ApiGetProductsResponse = Awaited<ReturnType<typeof handleGetProducts>>;

export async function handleGetProducts(params: ApiGetProductsQuery = {}) {
  const { data } = await stripeClientNext.products.list(params);
  return data;
}

handler.get(
  validation(ApiGetProductsSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetProductsSchema>;

    const data = await handleGetProducts(query);

    res.status(200).json(data satisfies NonNullable<ApiGetProductsResponse>);
  }
);


export default handler;