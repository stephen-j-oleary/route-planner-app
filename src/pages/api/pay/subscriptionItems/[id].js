import { isArray } from "lodash";

import nextConnect from "@/nextConnect";
import authMiddleware from "@/nextConnect/middleware/auth";
import parseExpand from "@/nextConnect/middleware/parseExpand";
import { NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  authMiddleware({ requireAccount: true, requireSubscription: false }),
  async (req, res) => {
    const { id, ...query } = req.query;

    const data = await stripeApiClient.subscriptionItems.retrieve(id, query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

handler.patch(
  authMiddleware({ requireAccount: true, requireSubscription: false }),
  async (req, res) => {
    const { query, body } = req;
    let { id } = query;
    if (isArray(id)) id = id[0];

    const subscription = await stripeApiClient.subscriptionItems.update(id, body);

    res.status(200).json(subscription);
  }
);

handler.delete(
  authMiddleware({ requireAccount: true, requireSubscription: false }),
  async (req, res) => {
    let { id } = req.query;
    if (isArray(id)) id = id[0];

    await stripeApiClient.subscriptionItems.del(id);

    res.status(204).end();
  }
);

export default handler;