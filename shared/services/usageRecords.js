import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/pay/usage";


export async function getUsageRecords(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export async function getUsageRecordsBySubscriptionItem(subscriptionItem, params = {}) {
  if (!subscriptionItem) return [];

  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params: { subscriptionItem, ...params },
  });

  return data;
}

export async function createUsageRecord(record) {
  const { data } = await httpClient.request({
    method: "post",
    url: "api/pay/webhooks/usage",
    headers: {
      "webhook-signature": process.env.STRIPE_PAYWEBHOOK_SECRET,
    },
    data: record,
  });
  return data;
}