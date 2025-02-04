"use server";

import { revalidatePath } from "next/cache";
import { redirect, RedirectType } from "next/navigation";

import { patchUser } from "@/app/api/user/actions";
import { UserProfileSchema } from "@/models/User/schemas";
import pages from "@/pages";


export default async function profileFormSubmit(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const data = await UserProfileSchema.validate(Object.fromEntries(formData.entries()));

    await patchUser(data);
  }
  catch (err) {
    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }

  // Update the root layout because auth session has changed
  revalidatePath(pages.root, "layout");

  // Must be called outside of the try/catch
  redirect(`${pages.account.root}?profile-saved`, RedirectType.replace);
}