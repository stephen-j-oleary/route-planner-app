import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  async (req, res) => {
    const { id, ...query } = req.query;

    const data = await stripeClient.prices.retrieve(id, query);
    if (!data) throw { status: 404, message: "Resource not found" };

    res.status(200).json(data);
  }
);

export default handler;