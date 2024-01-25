import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import parseExpand from "@/nextConnect/middleware/parseExpand";
import { NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  authorization({ isUser: true }),
  async (req, res) => {
    const { query } = req;

    const { data } = await stripeApiClient.subscriptionItems.list(query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export default handler;