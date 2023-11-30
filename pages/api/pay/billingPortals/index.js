import nextConnect from "@/shared/nextConnect";
import { AuthError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import { stripeApiClient } from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.post(async (req, res) => {
  const { body } = req;

  const authUser = await getAuthUser(req, res);
  if (!authUser) throw new AuthError();

  const session = await stripeApiClient.billingPortal.sessions.create({
    ...body,
    return_url: `${process.env.STRIPE_URL}/account/subscriptions`,
  });

  res.status(201).json(session);
});

export default handler;