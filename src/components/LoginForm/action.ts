"use server";

import { capitalize } from "@mui/material";

import { getAccounts } from "@/app/api/accounts/actions";
import { getUsers } from "@/app/api/users/actions";
import { signIn } from "@/utils/auth";


async function getAccountsForEmail(email: string) {
  const [user] = await getUsers({ email });
  if (!user) return [];
  return await getAccounts({ userId: user._id.toString() });
}

export async function loginEmailAction({ email }: { email: string }) {
  const accounts = await getAccountsForEmail(email);
  if (!accounts.length) return "register";

  if (!accounts.find(v => v.provider === "credentials")) {
    // TODO: Handle highlighting the provider account buttons
    throw new Error(`This account doesn't have a password. Use one of the following sign in methods: ${accounts.map(item => capitalize(item.provider)).join(", ")}`)
  }

  return "login";
}

export async function loginPasswordAction({ email, password }: { email: string, password: string }) {
  try {
    await signIn({ email, password });
  }
  catch (err) {
    throw new Error((err === "CredentialsSignin") ? "Incorrect email or password" : "An error occured. Please try again");
  }
}