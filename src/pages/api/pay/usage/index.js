import { isArray } from "lodash";

import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

handler.get(
  authorization({ isUser: true }),
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