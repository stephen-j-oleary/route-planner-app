"use server";

import { cookies } from "next/headers";

import { ApiPostWebhookUsageBody } from "@/app/api/webhooks/usage/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function createUsageRecord(usageData: ApiPostWebhookUsageBody) {
  const WEBHOOK_SECRET = process.env.STRIPE_PAYWEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Missing webhook secret");

  return await fetchJson(
    pages.api.webhooks.usage,
    {
      method: "POST",
      data: usageData,
      headers: {
        Cookie: cookies().toString(),
        "webhook-signature": WEBHOOK_SECRET,
      },
    },
  );
}