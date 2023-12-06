import { isArray, isBoolean, isNil, isString, isUndefined, omitBy } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/shared/nextConnect";
import parseQuery from "@/shared/nextConnect/middleware/parseQuery";
import { NotFoundError, RequestError } from "@/shared/utils/ApiErrors";
import { isValidPriceType } from "@/shared/utils/stripe";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

export type ApiGetPricesQuery = Pick<Stripe.PriceListParams, "active" | "currency" | "product" | "type" | "expand" | "lookup_keys">;
export type ApiGetPricesResponse = Awaited<ReturnType<typeof handleGetPrices>>;

export async function handleGetPrices(query: ApiGetPricesQuery) {
  const { data } = await stripeApiClient.prices.list(query);
  return data;
}

handler.get(
  parseQuery,
  async (req, res) => {
    const { active, currency, product, type, expand, lookup_keys } = req.query;
    if (!isUndefined(active) && !isBoolean(active)) throw new RequestError("Invalid param: 'active'");
    if (!isUndefined(currency) && !isString(currency)) throw new RequestError("Invalid param: 'currency'");
    if (!isUndefined(product) && !isString(product)) throw new RequestError("Invalid param: 'product'");
    if (!isUndefined(type) && !isValidPriceType(type)) throw new RequestError("Invalid param: 'type'");
    if (!isUndefined(expand) && !isArray(expand)) throw new RequestError("Invalid param: 'expand'");
    if (!isUndefined(lookup_keys) && !isArray(lookup_keys)) throw new RequestError("Invalid param: 'lookup_keys'");
    const query = omitBy({ active, currency, product, type, expand, lookup_keys }, isNil);

    const data = await handleGetPrices(query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export default handler;