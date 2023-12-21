import { isArray, isNil, isString, isUndefined, omitBy } from "lodash";
import Stripe from "stripe";

import nextConnect from "@/nextConnect";
import isCustomerAuthenticated from "@/nextConnect/middleware/isCustomerAuthenticated";
import isUserAuthenticated from "@/nextConnect/middleware/isUserAuthenticated";
import parseExpand from "@/nextConnect/middleware/parseExpand";
import { ForbiddenError, RequestError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

export type ApiGetPaymentMethodsQuery = Stripe.PaymentMethodListParams;
export type ApiGetPaymentMethodsResponse = Awaited<ReturnType<typeof handleGetPaymentMethods>>;
export async function handleGetPaymentMethods(query: ApiGetPaymentMethodsQuery) {
  const { data } = await stripeApiClient.paymentMethods.list(query);
  return data || [];
}

handler.get(
  parseExpand,
  isUserAuthenticated,
  isCustomerAuthenticated,
  async (req, res) => {
    const { customer, expand } = req.query;
    if (!isUndefined(customer) && !isString(customer)) throw new RequestError("Invalid param: 'customer'");
    if (!isUndefined(expand) && !isArray(expand)) throw new RequestError("Invalid param: 'expand'");
    const query = omitBy({ customer, expand }, isNil);

    const authUser = await getAuthUser(req, res);
    if (customer && customer !== authUser.customerId) throw new ForbiddenError();

    const data = await handleGetPaymentMethods({
      ...query,
      customer: authUser.customerId, /* Filter by authorized customer id */
    });

    res.status(200).json(data);
  }
);

export default handler;