import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  async (req, res) => {
    const { query } = req;

    const authUser = await getAuthUser(req, res);
    if (!authUser) throw { status: 401, message: "Not authorized" };

    const { data } = await stripeClient.checkout.sessions.list(query);
    if (!data) throw { status: 404, message: "Resource not found" };

    res.status(200).json(data);
  }
);

handler.post(
  async (req, res) => {
    const { body } = req;
    const {
      success_url,
      cancel_url,
      customer,
      customer_email,
    } = body;

    const authUser = await getAuthUser(req, res);
    if (
      !authUser
        || (customer && customer !== authUser.customerId)
        || (customer_email && customer_email !== authUser.email)
    ) throw { status: 401, message: "Not authorized" };

    const session = await stripeClient.checkout.sessions.create({
      ...body,
      success_url: createAbsoluteUrl(success_url),
      cancel_url: createAbsoluteUrl(cancel_url),
    });

    res.status(201).json(session);
  }
);

export default handler;


function createAbsoluteUrl(url) {
  return (url.startsWith("/") ? process.env.STRIPE_URL : "") + url;
}