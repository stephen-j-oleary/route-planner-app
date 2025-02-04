"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";

import VerifyFormSchema from "./schema";
import { getVerifyUser } from "@/app/api/user/verify/[code]/actions";
import { getVerifySend } from "@/app/api/user/verify/send/actions";
import pages from "@/pages";
import auth from "@/utils/auth";


export async function resendToken() {
  return await getVerifySend({ resend: true });
}

export default async function verifyUser(prevState: unknown, formData: FormData) {
  try {
    const { code, callbackUrl } = await VerifyFormSchema.validate(Object.fromEntries(formData.entries()));

    await getVerifyUser(code);

    await auth(cookies()).flow({
      step: pages.verify,
      callbackUrl,
    });
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}