import { handleGetSubscriptions } from "@/pages/api/pay/subscriptions";
import nextConnect from "@/shared/nextConnect";
import { createUsageRecord } from "@/shared/services/usageRecords";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import httpClient from "@/shared/utils/httpClient";

const URL = process.env.DIRECTIONS_API_URL;
const API_KEY = process.env.RAPID_API_KEY;
const API_HOST = process.env.RAPID_API_HOST;


const handler = nextConnect();

handler.get(async (req, res) => {
  const { query } = req;

  const authUser = await getAuthUser(req, res);
  if (!authUser?.customerId) throw { status: 401, message: "Not authorized" };

  const subscriptions = await handleGetSubscriptions({ customer: authUser.customerId });
  if (!subscriptions) throw { status: 401, message: "Not authorized" };

  const subscriptionItem = subscriptions[0].items.data[0];
  if (!subscriptionItem) throw { status: 401, message: "Not authorized" };

  const { data } = await httpClient.request({
    method: "get",
    url: URL,
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST
    },
    params: query
  });

  await createUsageRecord({
    subscriptionItem: subscriptionItem.id,
    quantity: 1,
  });

  res.status(200).json(data);
});

export default handler;