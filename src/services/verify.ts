import { ApiGetVerifyResponse } from "@/pages/api/user/verify";
import { ApiGetVerifyUserQuery, ApiGetVerifyUserResponse } from "@/pages/api/user/verify/[code]";
import httpClient from "@/utils/httpClient";

const BASE_PATH = "/api/user/verify";


export type GetVerifyReturn = ReturnType<typeof getVerify>;

export async function getVerify() {
  const { data } = await httpClient.request<ApiGetVerifyResponse>({
    method: "get",
    url: BASE_PATH,
  });

  return data;
}

export type VerifyUserParams = ApiGetVerifyUserQuery;
export type VerifyUserReturn = ReturnType<typeof verifyUser>;

export async function verifyUser({ code }: VerifyUserParams) {
  const { data } = await httpClient.request<ApiGetVerifyUserResponse>({
    method: "get",
    url: `${BASE_PATH}/${code}`,
  });

  return data;
}

export async function verifyUserResend() {
  const { data } = await httpClient.request({
    method: "get",
    url: `${BASE_PATH}/resend`,
  });

  return data;
}