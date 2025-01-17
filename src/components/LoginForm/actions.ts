"use server";

import { capitalize } from "lodash-es";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

import LoginFormSchema from "./schema";
import { getAccounts } from "@/app/api/accounts/actions";
import { getUserSubscriptions } from "@/app/api/user/subscriptions/actions";
import { signIn } from "@/utils/auth/actions";
import { appendQuery } from "@/utils/url";
import pages from "pages";


export async function loginFormEmailSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const { email, callbackUrl } = await LoginFormSchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { step: "email" } },
    );

    const accounts = await getAccounts({ userEmail: email });
    if (!accounts.length) redirect(appendQuery(pages.login_new, { email, callbackUrl }));

    if (!accounts.find(v => v.provider === "credentials")) {
      throw new Error(`This account doesn't have a password. Use one of the following sign in methods: ${accounts.map(item => capitalize(item.provider)).join(", ")}`)
    }

    redirect(appendQuery(pages.login_existing, { email, callbackUrl }));
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
    const { email, password, callbackUrl } = await LoginFormSchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { step: "password" } },
    );

    const { customerId } = await signIn({ email, password });
    const subscriptions = await getUserSubscriptions({ customer: customerId });

    if (!subscriptions.length) redirect(appendQuery(pages.plans, { callbackUrl }));
    redirect(callbackUrl);
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : err === "CredentialsSignin" ? "Incorrect email or password" : "An error occurred. Please try aggain" };
  }
}