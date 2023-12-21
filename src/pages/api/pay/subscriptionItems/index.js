import nextConnect from "@/nextConnect";
import isUserAuthenticated from "@/nextConnect/middleware/isUserAuthenticated";
import parseExpand from "@/nextConnect/middleware/parseExpand";
import { NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  isUserAuthenticated,
  async (req, res) => {
    const { query } = req;

    const { data } = await stripeApiClient.subscriptionItems.list(query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export default handler;