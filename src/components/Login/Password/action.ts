"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import LoginFormSchema from "../schema";
import pages from "@/pages";
import auth from "@/utils/auth";
import { handleSignIn } from "@/utils/auth/actions";


export default async function loginFormPasswordSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const { email, password, ...searchParams } = await LoginFormSchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { step: "password" } },
    );

    await handleSignIn({ email, password });

    await auth(pages.login_password).flow({ searchParams, next: true });
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : err === "CredentialsSignin" ? "Incorrect email or password" : "An error occurred. Please try aggain" };
  }
}