"use server";

import { redirect, RedirectType } from "next/navigation";

import ChangePasswordSchema from "./schema";
import { patchUserAccountById } from "@/app/api/user/accounts/[id]/actions";
import pages from "pages";


export default async function changePasswordFormSubmit(
  prevState: unknown,
  data: FormData,
) {
  try {
    const { id, ...changes } = await ChangePasswordSchema.validate(Object.fromEntries(data.entries()));

    await patchUserAccountById(id, changes);
  }
  catch (err) {
    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }

  redirect(`${pages.account.root}?password-changed`, RedirectType.replace);
}