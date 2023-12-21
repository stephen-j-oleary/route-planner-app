import { isArray } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import { NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

export type ApiGetProductByIdQuery = { id: string } & Stripe.ProductRetrieveParams;
export type ApiGetProductByIdResponse = Awaited<ReturnType<typeof handleGetProductById>>;

export async function handleGetProductById(id: string, params: Omit<ApiGetProductByIdQuery, "id"> = {}) {
  return await stripeApiClient.products.retrieve(id, params);
}

handler.get(async (req, res) => {
  const { id, ...query } = req.query;

  const data = await handleGetProductById(isArray(id) ? id[0] : id, query);
  if (!data) throw new NotFoundError();

  res.status(200).json(data);
});

export default handler;