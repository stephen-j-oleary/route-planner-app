import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  async (req, res, next) => {
    const authUser = await getAuthUser(req, res);
    if (!authUser?.customerId || authUser.customerId !== req.query.customerId) throw { status: 401, message: "Not authorized" };

    next();
  },
  async (req, res) => {
    const { customerId, ...query } = req.query;

    const data = await stripeClient.customers.retrieve(customerId, query);
    if (!data) throw { status: 404, message: "Resource not found" };

    res.status(200).json(data);
  }
);

export default handler;