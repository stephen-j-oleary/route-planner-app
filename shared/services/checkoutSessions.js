import httpClient from "@/shared/utils/httpClient";


export async function createCheckoutSession(session) {
  const { data } = await httpClient.request({
    method: "post",
    url: "api/pay/checkoutSessions",
    data: session,
  });
  return data;
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