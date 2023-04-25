import nextConnect from "@/shared/nextConnect";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.post(async (req, res) => {
  const { body } = req;

  const authUser = await getAuthUser(req, res);
  if (!authUser) throw { status: 401, message: "Not authorized" };

  const session = await stripeClient.billingPortal.sessions.create({
    ...body,
    return_url: `${process.env.STRIPE_URL}/profile/subscriptions`,
  });

  res.status(201).json(session);
});

export default handler;