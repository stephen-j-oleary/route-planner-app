"use server";

import { isRedirectError } from "next/dist/client/components/redirect";

import LoginFormSchema from "../schema";
import pages from "@/pages";
import auth from "@/utils/auth";


export default async function loginFormEmailSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const { password, ...searchParams } = await LoginFormSchema.validate(
      Object.fromEntries(formData.entries()),
      { context: { step: "email" } },
    );

    await auth(pages.login_email).flow({ searchParams, next: pages.login_password });
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}