import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import stripeClient from "@/shared/utils/stripeClient";


export async function handleGetSubscriptions(query) {
  const { data } = await stripeClient.subscriptions.list(query);
  if (!data) throw { status: 404, message: "Resource not found" };

  return data;
}


const handler = nextConnect();

handler.get(
  parseExpand,
  async (req, res, next) => {
    res.locals.data = await handleGetSubscriptions(req.query);
    next();
  },
  async function filterDataByAuthUser(req, res) {
    const authUser = await getAuthUser(req, res);
    if (!authUser?.customerId) throw { status: 401, message: "Not authorized" };

    const data = res.locals.data.filter(item => item.customer === authUser.customerId);

    res.status(200).json(data);
  }
);

export default handler;