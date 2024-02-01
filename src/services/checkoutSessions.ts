import { ApiPostUserCheckoutSessionBody, ApiPostUserCheckoutSessionResponse } from "@/pages/api/user/checkoutSession";
import httpClient from "@/utils/httpClient";

const BASE_URL = "api/user/checkoutSession";


export type CreateUserCheckoutSessionData = ApiPostUserCheckoutSessionBody;
export type CreateUserCheckoutSessionResponse = ReturnType<typeof createUserCheckoutSession>;

export async function createUserCheckoutSession(data: CreateUserCheckoutSessionData) {
  const res = await httpClient.request<ApiPostUserCheckoutSessionResponse>({
    method: "post",
    url: BASE_URL,
    data,
  });

  return res.data;
}