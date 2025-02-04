"use server";

import { capitalize } from "lodash-es";
import { isRedirectError } from "next/dist/client/components/redirect";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginFormSchema from "./schema";
import { getAccounts } from "@/app/api/accounts/actions";
import pages from "@/pages";
import auth from "@/utils/auth";
import { signIn } from "@/utils/auth/actions";
import { appendQuery } from "@/utils/url";


export async function loginFormEmailSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const { email, callbackUrl, plan } = await LoginFormSchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { step: "email" } },
    );

    const accounts = await getAccounts({ userEmail: email });
    if (!accounts.length) redirect(appendQuery(pages.login_new, { email, callbackUrl, plan }));

    if (!accounts.find(v => v.provider === "credentials")) {
      throw new Error(`This account doesn't have a password. Use one of the following sign in methods: ${accounts.map(item => capitalize(item.provider)).join(", ")}`)
    }

    redirect(appendQuery(pages.login_existing, { email, callbackUrl, plan }));
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}

export async function loginFormPasswordSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const { email, password, callbackUrl, plan } = await LoginFormSchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { step: "password" } },
    );

    await signIn({ email, password });

    // Auth next
    await auth(cookies()).flow({
      step: pages.login,
      callbackUrl,
      plan,
    });
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : err === "CredentialsSignin" ? "Incorrect email or password" : "An error occurred. Please try aggain" };
  }
}