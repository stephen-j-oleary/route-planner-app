import nextConnect from "@/shared/nextConnect";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import stripeClient from "@/shared/utils/stripeClient";


const handler = nextConnect();

handler.get(async (req, res) => {
  const { subscriptionItem, ...query } = req.query;

  const authUser = await getAuthUser(req, res);
  if (!authUser) throw { status: 401, message: "Not authorized" };

  const { data } = await stripeClient.subscriptionItems.listUsageRecordSummaries(
    subscriptionItem,
    query
  );

  res.status(200).json(data);
});

export default handler;