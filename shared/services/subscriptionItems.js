import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/pay/subscriptionItems";


export async function getSubscriptionItemsBySubscription(subscription, params = {}) {
  if (!subscription) return [];

  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params: { subscription, ...params },
  });

  return data;
}

export async function getSubscriptionItemById(id, params = {}) {
  if (!id) return null;

  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}