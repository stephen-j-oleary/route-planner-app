import { isArray } from "lodash";

import nextConnect from "@/nextConnect";
import isUserAuthenticated from "@/nextConnect/middleware/isUserAuthenticated";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

handler.get(
  isUserAuthenticated,
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