import { isArray, isString } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import parseQuery from "@/nextConnect/middleware/parseQuery";
import { NotFoundError, RequestError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

export type ApiGetPriceQuery = { id: string };
export type ApiGetPriceResponse = Stripe.Response<Stripe.Price>;

export async function handleGetPriceById(id: ApiGetPriceQuery["id"]) {
  return await stripeApiClient.prices.retrieve(id);
}

handler.get(
  parseQuery,
  async (req, res) => {
    let { id } = req.query;
    if (isArray(id)) id = id[0];
    if (!isString(id)) throw new RequestError("Invalid id");

    const data = await handleGetPriceById(id);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export default handler;