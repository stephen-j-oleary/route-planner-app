import { ApiPostWebhookUsageBody } from "@/pages/api/webhooks/usage";
import httpClient from "@/utils/httpClient";


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