import { ApiPostWebhookUsageBody } from "@/pages/api/webhooks/usage";
import httpClient from "@/utils/httpClient";

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


export type CreateUsageRecordData = ApiPostWebhookUsageBody;

export async function createUsageRecord(data: CreateUsageRecordData) {
  const WEBHOOK_SECRET = process.env.STRIPE_PAYWEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Missing webhook secret");

  return await httpClient.request({
    method: "post",
    url: "api/webhooks/usage",
    headers: { "webhook-signature": WEBHOOK_SECRET },
    data,
  });
}