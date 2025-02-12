"use server";

import { isEqual } from "lodash-es";
import { revalidatePath } from "next/cache";

import { authSession } from ".";
import { _handleCheckAccount, _handleLinkAccount, _updateAuth } from "./helpers";
import pages from "@/pages";
import pojo from "@/utils/pojo";


type SignInData =
  & { email: string, link?: boolean }
  & ({ password: string, code?: never } | { password?: never, code: string });

/**
 * Called to attempt a sign in (when called with link = undefined or false), account link (when called with link = true), or session update (when called without data)
 * @param data (Optional) The data to use for the sign in attempt
 * @returns The updated session
 */
export async function handleSignIn(data?: SignInData) {
  const currSession = await authSession();
  let userId = currSession.user?.id;

  if (data) {
    const { link, ...credentials } = data;

    const user = link
      ? await _handleLinkAccount(credentials)
      : await _handleCheckAccount(credentials);

    userId = user._id.toString();
  }

  const newSession = await _updateAuth(userId);

  if (!isEqual(currSession, newSession))
    revalidatePath(pages.api.session);

  return pojo(newSession);
}


export async function signOut() {
  const session = await authSession();
  session.destroy();

  revalidatePath(pages.root, "layout");
  revalidatePath(pages.api.session);

  return;
}