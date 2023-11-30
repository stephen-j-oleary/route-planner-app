import nextConnect from "@/shared/nextConnect";
import isUserAuthenticated from "@/shared/nextConnect/middleware/isUserAuthenticated";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { NotFoundError } from "@/shared/utils/ApiErrors";
import { stripeApiClient } from "@/shared/utils/stripeClient";


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