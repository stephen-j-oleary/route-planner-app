"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import LoginFormSchema from "../schema";
import Account from "@/models/Account";
import pages from "@/pages";
import auth from "@/utils/auth";
import connectMongoose from "@/utils/connectMongoose";


export default async function loginFormChangeSubmit(
  prevState: unknown,
  data: FormData,
) {
  try {
    const { email, password, ...searchParams } = await LoginFormSchema.validate(
      Object.fromEntries(data.entries()),
      { context: { step: "password" } },
    );

    await connectMongoose();

    await Account.findOneAndUpdate(
      { provider: "credentials", credentials_email: email },
      { credentials_password: password },
    ).lean().exec();

    await auth(pages.login_change).flow({ searchParams, next: true });
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : err === "CredentialsSignin" ? "Incorrect email or password" : "An error occurred. Please try aggain" };
  }
}