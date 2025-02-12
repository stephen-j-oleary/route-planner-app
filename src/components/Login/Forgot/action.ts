"use server";

import { isRedirectError } from "next/dist/client/components/redirect";

import LoginFormSchema from "../schema";
import pages from "@/pages";
import auth from "@/utils/auth";
import EmailVerifier from "@/utils/auth/EmailVerifier";


export default async function loginFormForgotSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const searchParams = await LoginFormSchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { step: "forgot" } },
    );
    const { email } = searchParams;

    await EmailVerifier({ email }).send("password").catch(() => {});

    await auth(pages.login_forgot).flow({ searchParams: { ...searchParams, intent: "change" }, next: pages.login_verify });
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}