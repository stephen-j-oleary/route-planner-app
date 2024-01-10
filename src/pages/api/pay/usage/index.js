import { isArray } from "lodash";

import nextConnect from "@/nextConnect";
import authMiddleware from "@/nextConnect/middleware/auth";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

handler.get(
  authMiddleware({ requireAccount: true, requireSubscription: false }),
  async (req, res) => {
    let { subscriptionItem, ...query } = req.query;
    if (isArray(subscriptionItem)) subscriptionItem = subscriptionItem[0];

    const { data } = await stripeApiClient.subscriptionItems.listUsageRecordSummaries(
      subscriptionItem,
      query
    );

    res.status(200).json(data);
  }
);

export default handler;