"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { ApiGetVerifyUserResponse } from "@/app/api/user/verify/[code]/route";
import { ApiGetVerifySendQuery } from "@/app/api/user/verify/send/route";
import fetchJson from "@/utils/fetchJson";
import pages from "pages";


export async function verifyUser({ code }: { code: string }) {
  const data = await fetchJson<ApiGetVerifyUserResponse>(
    `${pages.api.userVerify}/${code}`,
    {
      method: "GET",
      headers: { Cookie: cookies().toString() },
    },
  );

  revalidatePath(pages.api.user);
  revalidatePath(pages.api.session);

  return data;
}


export async function verifyUserSend(params: ApiGetVerifySendQuery) {
  const data = await fetchJson(
    pages.api.userVerifySend,
    {
      method: "GET",
      query: params,
      headers: { Cookie: cookies().toString() },
    },
  );

  revalidatePath(pages.api.userVerify);

  return data;
}