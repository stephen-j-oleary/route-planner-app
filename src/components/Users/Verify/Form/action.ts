"use server";

import { redirect } from "next/navigation";

import VerifyFormSchema from "./schema";
import { getVerifyUser } from "@/app/api/user/verify/[code]/actions";
import { getVerifySend } from "@/app/api/user/verify/send/actions";


export async function resendToken() {
  return await getVerifySend({ resend: true });
}

export default async function verifyUser(prevState: unknown, formData: FormData) {
  try {
    const { code } = await VerifyFormSchema.validate(Object.fromEntries(formData.entries()));

    await getVerifyUser(code);
  }
  catch (err) {
    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }

  const callbackUrl = formData.get("callbackUrl");
  if (typeof callbackUrl === "string") redirect(callbackUrl);
}