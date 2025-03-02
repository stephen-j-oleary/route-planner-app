"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import LoginFormVerifySchema from "./schema";
import pages from "@/pages";
import auth from "@/utils/auth";
import { handleSignIn } from "@/utils/auth/actions";


export default async function loginFormVerifySubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const { email, code, ...searchParams } = await LoginFormVerifySchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { step: "verify" } },
    );

    await handleSignIn({ email, code });

    await auth(pages.login_verify).flow({ searchParams });
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}