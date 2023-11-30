import Stripe from "stripe";

import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

export type ApiGetProductsQuery = Stripe.ProductListParams;
export type ApiGetProductsResponse = Awaited<ReturnType<typeof handleGetProducts>>;

export async function handleGetProducts(params: ApiGetProductsQuery = {}) {
  const { data } = await stripeApiClient.products.list(params);
  return data;
}

handler.get(
  parseExpand,
  async (req, res) => {
    const { query } = req;

    const data = await handleGetProducts(query);
    res.status(200).json(data);
  }
);

export default handler;