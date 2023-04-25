import nextConnect from "@/shared/nextConnect";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(async (req, res) => {
  const { query } = req;

  const { data } = await stripeClient.invoices.list(query);

  res.status(200).json(data);
});

export default handler;