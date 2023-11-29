import { isBoolean, isNil, isString, omitBy } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/shared/nextConnect";
import parseQuery from "@/shared/nextConnect/middleware/parseQuery";
import { NotFoundError, RequestError } from "@/shared/utils/ApiErrors";
import { isValidPriceType } from "@/shared/utils/stripe";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

export interface ApiGetPricesQuery extends Stripe.PriceListParams {}
export type ApiGetPricesResponse = Awaited<ReturnType<typeof handleGetPrices>>;

export async function handleGetPrices(query: ApiGetPricesQuery) {
  const { data } = await stripeApiClient.prices.list(query);
  return data;
}

handler.get(
  parseQuery,
  async (req, res) => {
    const { active, currency, product, type } = req.query;
    if (!isBoolean(active)) throw new RequestError("Invalid active");
    if (!isString(currency)) throw new RequestError("Invalid currency");
    if (!isString(product)) throw new RequestError("Invalid product");
    if (!isValidPriceType(type)) throw new RequestError("Invalid type");
    const query = omitBy({ active, currency, product, type }, isNil);

    const data = await handleGetPrices(query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export default handler;