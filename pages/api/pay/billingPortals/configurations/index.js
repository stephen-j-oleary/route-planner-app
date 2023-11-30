import nextConnect from "@/shared/nextConnect";
import parseExpand from "@/shared/nextConnect/middleware/parseExpand";
import { AuthError, NotFoundError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(
  parseExpand,
  async (req, res) => {
    const { query } = req;

    const authUser = await getAuthUser(req, res);
    if (!authUser) throw new AuthError();

    const { data } = await stripeApiClient.billingPortal.configurations.list(query);
    if (!data) throw new NotFoundError();

    res.status(200).json(data);
  }
);

handler.post(
  async (req, res) => {
    const { body } = req;

    const authUser = await getAuthUser(req, res);
    if (!authUser) throw new AuthError();

    const data = await stripeApiClient.billingPortal.configurations.create(body);

    res.status(201).json(data);
  }
);

export default handler;