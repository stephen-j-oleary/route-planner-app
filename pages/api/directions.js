import { handleGetSubscriptions } from "@/pages/api/pay/subscriptions";
import nextConnect from "@/shared/nextConnect";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";
import httpClient from "@/shared/utils/httpClient";

const URL = process.env.LOOP_DIRECTIONS_URL;
const API_KEY = process.env.LOOP_RAPIDAPI_KEY;
const API_HOST = process.env.LOOP_RAPIDAPI_HOST;


export const getDirectionsHandler = async (req, res) => {
  const { query } = req;

  const authUser = await getAuthUser(req, res).catch(() => null);
  if (!authUser) throw { status: 401, message: "Sign in required" };
  if (!authUser.customerId) throw { status: 401, message: "Subscription required" };

  const subscriptions = await handleGetSubscriptions({ customer: authUser.customerId });
  if (!subscriptions?.length) throw { status: 401, message: "Subscription required" };

  const subscriptionItem = subscriptions[0].items?.data?.[0];
  if (!subscriptionItem) throw { status: 401, message: "Subscription required" };

  const { data } = await httpClient.request({
    method: "get",
    url: URL,
    headers: {
      "X-RapidAPI-Key": API_KEY,
      "X-RapidAPI-Host": API_HOST
    },
    params: query
  });

  res.status(200).json(data);
};


const handler = nextConnect()
  .get(getDirectionsHandler);

export default handler;