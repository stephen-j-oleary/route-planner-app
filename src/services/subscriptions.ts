import { ApiGetSubscriptionsQuery, ApiGetSubscriptionsResponse, ApiPostSubscriptionsBody, ApiPostSubscriptionsResponse } from "@/pages/api/pay/subscriptions";
import { ApiDeleteSubscriptionQuery, ApiDeleteSubscriptionResponse, ApiGetSubscriptionQuery, ApiGetSubscriptionResponse, ApiPatchSubscriptionBody, ApiPatchSubscriptionResponse } from "@/pages/api/pay/subscriptions/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/pay/subscriptions";


export type GetSubscriptionsParams = ApiGetSubscriptionsQuery;
export type GetSubscriptionsReturn = ReturnType<typeof getSubscriptions>;

export async function getSubscriptions(params: GetSubscriptionsParams = {}) {
  const { data } = await httpClient.request<ApiGetSubscriptionsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export type GetSubscriptionByIdParams = Omit<ApiGetSubscriptionQuery, "id">;
export type GetSubscriptionByIdReturn = ReturnType<typeof getSubscriptionById>;

export async function getSubscriptionById(id: string, params: GetSubscriptionByIdParams = {}) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetSubscriptionResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}

export type CreateSubscriptionData = ApiPostSubscriptionsBody;
export type CreateSubscriptionReturn = ReturnType<typeof createSubscription>;

export async function createSubscription(data: CreateSubscriptionData) {
  const res = await httpClient.request<ApiPostSubscriptionsResponse>({
    method: "post",
    url: BASE_PATH,
    data,
  });

  return res.data;
}

export type UpdateSubscriptionByIdData = ApiPatchSubscriptionBody;
export type UpdateSubscriptionByIdReturn = ReturnType<typeof updateSubscriptionById>;

export async function updateSubscriptionById(id: string, data: UpdateSubscriptionByIdData) {
  const res = await httpClient.request<ApiPatchSubscriptionResponse>({
    method: "patch",
    url: `${BASE_PATH}/${id}`,
    data,
  });

  return res.data;
}

export type CancelSubscriptionByIdQuery = Omit<ApiDeleteSubscriptionQuery, "id">;
export type CancelSubscriptionByIdReturn = ReturnType<typeof cancelSubscriptionById>;

export async function cancelSubscriptionById(id: string, params: CancelSubscriptionByIdQuery = {}) {
  const res = await httpClient.request<ApiDeleteSubscriptionResponse>({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return res.data;
}