import { ApiGetUserSubscriptionsQuery, ApiGetUserSubscriptionsResponse } from "@/pages/api/user/subscriptions";
import { ApiDeleteUserSubscriptionByIdResponse, ApiGetUserSubscriptionByIdResponse, ApiPatchUserSubscriptionByIdBody, ApiPatchUserSubscriptionByIdResponse } from "@/pages/api/user/subscriptions/[id]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "api/user/subscriptions";


export type GetUserSubscriptionsParams = ApiGetUserSubscriptionsQuery;
export type GetUserSubscriptionsReturn = ReturnType<typeof getUserSubscriptions>;

export async function getUserSubscriptions(params: GetUserSubscriptionsParams = {}) {
  const { data } = await httpClient.request<ApiGetUserSubscriptionsResponse>({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}


export type GetUserSubscriptionByIdReturn = ReturnType<typeof getUserSubscriptionById>;

export async function getUserSubscriptionById(id: string | undefined) {
  if (!id) return null;

  const { data } = await httpClient.request<ApiGetUserSubscriptionByIdResponse>({
    method: "get",
    url: `${BASE_PATH}/${id}`,
  });

  return data;
}


export type UpdateUserSubscriptionByIdData = ApiPatchUserSubscriptionByIdBody;
export type UpdateUserSubscriptionByIdReturn = ReturnType<typeof updateUserSubscriptionById>;

export async function updateUserSubscriptionById(id: string, data: UpdateUserSubscriptionByIdData) {
  const res = await httpClient.request<ApiPatchUserSubscriptionByIdResponse>({
    method: "patch",
    url: `${BASE_PATH}/${id}`,
    data,
  });

  return res.data;
}


export type CancelUserSubscriptionByIdReturn = ReturnType<typeof cancelUserSubscriptionById>;

export async function cancelUserSubscriptionById(id: string) {
  const res = await httpClient.request<ApiDeleteUserSubscriptionByIdResponse>({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
  });

  return res.data;
}