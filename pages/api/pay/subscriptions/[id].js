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
    if (!authUser?.customerId) throw { status: 401, message: "Not authorized" };

    const data = await stripeClient.subscriptions.retrieve(id, query);
    if (!data) throw { status: 404, message: "Resource not found" };

    if (data.customer !== authUser.customerId) throw { status: 403, message: "Forbidden" };

    res.status(200).json(data);
  }
);

handler.patch(
  async (req, res) => {
    const { query, body } = req;
    const { id } = query;

    const authUser = await getAuthUser(req, res);
    if (!authUser?.customerId) throw { status: 401, message: "Not authorized" };

    const data = await stripeClient.subscriptions.retrieve(id);
    if (!data) throw { status: 404, message: "Resource not found" };

    if (data.customer !== authUser.customerId) throw { status: 403, message: "Forbidden" };

    const subscription = await stripeClient.subscriptions.update(id, body);
    res.status(200).json(subscription);
  }
);

handler.delete(
  async (req, res) => {
    const {
      id,
      invoice_now = true,
      prorate = true,
      ...query
    } = req.query;

    const authUser = await getAuthUser(req, res);
    if (!authUser) throw { status: 401, message: "Not authorized" };

    await stripeClient.subscriptions.del(id, {
      invoice_now,
      prorate,
      ...query
    });

    res.status(204).end();
  }
);

export default handler;