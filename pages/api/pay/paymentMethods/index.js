import { isString } from "lodash";

import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { AuthError, NotFoundError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  async (req, res) => {
    const { query } = req;

    const authUser = await getAuthUser(req, res);
    if (!authUser?.customerId) throw new AuthError();

    let { data } = await stripeApiClient.paymentMethods.list(query);
    if (!data) throw new NotFoundError();
    data = data.filter(item => (isString(item.customer) ? item.customer : item.customer.id) === authUser.customerId);

    res.status(200).json(data);
  }
);

export default handler;