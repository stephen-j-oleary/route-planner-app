import httpClient from "@/shared/utils/httpClient";

const BASE_PATH = "api/pay/subscriptions";


export async function getSubscriptions(params = {}) {
  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params,
  });

  return data;
}

export async function getSubscriptionsByCustomer(customer, params = {}) {
  if (!customer) return [];

  const { data } = await httpClient.request({
    method: "get",
    url: BASE_PATH,
    params: {
      customer,
      ...params,
    },
  });

  return data;
}

export async function getSubscriptionById(id, params = {}) {
  if (!id) return null;

  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}

export async function updateSubscriptionById(id, changes) {
  const { data } = await httpClient.request({
    method: "patch",
    url: `${BASE_PATH}/${id}`,
    data: changes,
  });

  return data;
}

export async function deleteSubscriptionById(id, params = {}) {
  const { data } = await httpClient.request({
    method: "delete",
    url: `${BASE_PATH}/${id}`,
    params,
  });

  return data;
}