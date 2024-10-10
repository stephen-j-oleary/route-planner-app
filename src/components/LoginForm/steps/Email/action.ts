"use server";

import { capitalize } from "lodash-es";

import LoginFormEmailSchema from "./schema";
import { getAccounts } from "@/app/api/accounts/actions";
import { getUsers } from "@/app/api/users/actions";


async function getAccountsForEmail(email: string) {
  const [user] = await getUsers({ email });
  if (!user) return [];
  return await getAccounts({ userId: user._id.toString() });
}


export default async function loginFormEmailSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const { email } = await LoginFormEmailSchema.validate(Object.fromEntries(formData.entries()));

    const accounts = await getAccountsForEmail(email);
    if (!accounts.length) return { nextStep: "register" };

    if (!accounts.find(v => v.provider === "credentials")) {
      // TODO: Handle highlighting the provider account buttons
      throw new Error(`This account doesn't have a password. Use one of the following sign in methods: ${accounts.map(item => capitalize(item.provider)).join(", ")}`)
    }

    return { nextStep: "login" };
  }
  catch (err) {
    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}