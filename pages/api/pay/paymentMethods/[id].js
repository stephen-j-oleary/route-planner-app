import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  async (req, res) => {
    const { id, ...query } = req.query;

    const authUser = await getAuthUser(req, res);
    if (!authUser) throw { status: 401, message: "Not authorized" };

    const data = await stripeClient.paymentMethods.retrieve(id, query);
    if (!data) throw { status: 404, message: "Resource not found" };

    res.status(200).json(data);
  }
);

handler.delete(
  async (req, res) => {
    const { id } = req.query;

    const authUser = await getAuthUser(req, res);
    if (!authUser) throw { status: 401, message: "Not authorized" };

    await stripeClient.paymentMethods.detach(id);

    res.status(204).end();
  }
);

export default handler;