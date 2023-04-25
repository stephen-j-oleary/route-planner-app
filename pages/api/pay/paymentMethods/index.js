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
    if (!authUser?.customerId) throw { status: 401, message: "Not authorized" };

    let { data } = await stripeClient.paymentMethods.list(query);
    if (!data) throw { status: 404, message: "Resource not found" };
    data = data.filter(item => (item.customer?.id || item.customer) === authUser.customerId);

    res.status(200).json(data);
  }
);

export default handler;