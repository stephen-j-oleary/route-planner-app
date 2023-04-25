import nextConnect from "@/shared/nextConnect";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(async (req, res) => {
  const { id } = req.query;

  const data = await stripeClient.products.retrieve(id);
  res.status(200).json(data);
});

export default handler;