import { ApiPostCheckoutSessionBody, APiPostCheckoutSessionResponse } from "@/pages/api/pay/checkoutSessions";
import httpClient from "@/shared/utils/httpClient";


export type CreateCheckoutSessionData = ApiPostCheckoutSessionBody;
export type CreateCheckoutSessionResponse = Awaited<ReturnType<typeof createCheckoutSession>>;

export async function createCheckoutSession(data: CreateCheckoutSessionData) {
  const res = await httpClient.request<APiPostCheckoutSessionResponse>({
    method: "post",
    url: "api/pay/checkoutSessions",
    data,
  });
  return res.data;
}

export async function getAllCheckoutSessions(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: "api/pay/checkoutSessions",
    params,
  });
  return data;
}

export async function getCheckoutSessionById(id) {
  const { data } = await httpClient.request({
    method: "get",
    url: `api/pay/checkoutSessions/${id}`,
  });
  return data;
}