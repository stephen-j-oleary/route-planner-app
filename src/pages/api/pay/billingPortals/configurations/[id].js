import nextConnect from "@/nextConnect";
import { AuthError, NotFoundError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";
import { stripeApiClient } from "@/utils/stripeClient";


const handler = nextConnect();

handler.get(
  async (req, res) => {
    const { id, ...query } = req.query;

    const authUser = await getAuthUser(req, res);
    if (!authUser) throw new AuthError();

    const data = await stripeApiClient.billingPortal.configurations.retrieve(id, query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

export default handler;