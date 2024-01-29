import nextConnect from "@/nextConnect";
import authorization from "@/nextConnect/middleware/authorization";
import { NotFoundError } from "@/utils/ApiErrors";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();


handler.get(
  authorization({ isUser: true }),
  async (req, res) => {
    const { query } = req;

    const { data } = await stripeApiClient.subscriptionItems.list(query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export default handler;