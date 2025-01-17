"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { _handleCheckAccount, _handleLinkAccount, _updateAuth, auth } from ".";
import { PostUserBodySchema, TPostUserBody } from "@/models/User/schemas";
import pages from "pages";


/**
 * Called to attempt a sign in (when called with link = undefined or false), account link (when called with link = true), or session update (when called without data)
 * @param data (Optional) The data to use for the sign in attempt
 * @returns The updated session
 */
export async function signIn(data?: TPostUserBody) {
  const { userId } = await auth(cookies());
  let _userId = userId;

  if (data) {
    const { link, ...credentials } = await PostUserBodySchema.validate(data);

    const user = link
      ? await _handleLinkAccount(credentials)
      : await _handleCheckAccount(credentials);

    _userId = user._id.toString();
  }

  const session = await _updateAuth(cookies(), _userId);

  revalidatePath(pages.root, "layout");

  return session;
}

export async function signOut() {
  const session = await auth(cookies());
  session.destroy();

  revalidatePath(pages.root, "layout");

  return;
}