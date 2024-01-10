import { isArray, isString } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import authMiddleware from "@/nextConnect/middleware/auth";
import parseQuery from "@/nextConnect/middleware/parseQuery";
import { ForbiddenError, NotFoundError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import compareMongoIds from "@/utils/compareMongoIds";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

export interface ApiGetCustomerQuery extends Stripe.CustomerRetrieveParams {
  customerId: string;
}
export type ApiGetCustomerResponse = Awaited<ReturnType<typeof handleGetCustomerById>>;

export async function handleGetCustomerById(id: ApiGetCustomerQuery["customerId"], query: Omit<ApiGetCustomerQuery, "customerId"> = {}) {
  return await stripeApiClient.customers.retrieve(id, query);
}

handler.get(
  parseQuery,
  authMiddleware({ requireAccount: true, requireSubscription: true }),
  async (req, res) => {
    // eslint-disable-next-line prefer-const
    let { customerId, ...query } = req.query;
    if (isArray(customerId)) customerId = customerId[0];
    if (!isString(customerId)) throw new RequestError("Invalid customerId");

    const authUser = await getAuthUser(req, res);
    if (!compareMongoIds(authUser.customerId, customerId)) throw new ForbiddenError();

    const data = await handleGetCustomerById(customerId, query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);


export type ApiDeleteCustomerQuery = Stripe.CustomerDeleteParams & { id: string }
export type ApiDeleteCustomerRepsonse = Awaited<ReturnType<typeof handleDeleteCustomer>>

export async function handleDeleteCustomer(id: ApiDeleteCustomerQuery["id"], params: Omit<ApiDeleteCustomerQuery, "id"> = {}) {
  const { deleted } = await stripeApiClient.customers.del(id, params);
  return { deletedCount: +deleted };
}

export default handler;