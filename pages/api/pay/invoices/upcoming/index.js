import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.use(parseExpand);

handler.get(
  async (req, res) => {
    const { query } = req;

    const data = await stripeClient.invoices.retrieveUpcoming(query);
    if (!data) throw { status: 404, message: "Resource not found" };

    res.status(200).json(data);
  }
);

handler.post(
  async (req, res) => {
    const { body } = req;

    const data = await stripeClient.invoices.retrieveUpcoming(body);
    if (!data) throw { status: 500, message: "Resource not created" };

    res.status(201).json(data);
  }
);

export default handler;