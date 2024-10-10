"use server";

import { redirect } from "next/navigation";

import LoginFormPasswordSchema from "./schema";
import { signIn } from "@/utils/auth";


export default async function loginFormPasswordSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const { email, password } = await LoginFormPasswordSchema.validate(Object.fromEntries(formData.entries()));

    await signIn({ email, password });
  }
  catch (err) {
    console.error(err);
    return { error: err instanceof Error ? err.message : err === "CredentialsSignin" ? "Incorrect email or password" : "An error occurred. Please try aggain" };
  }

  const callbackUrl = formData.get("callbackUrl");
  if (typeof callbackUrl === "string") redirect(callbackUrl);
}