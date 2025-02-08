"use server";

import { isEqual } from "lodash-es";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import auth from ".";
import { _handleCheckAccount, _handleLinkAccount, _updateAuth } from "./helpers";
import { PostUserBodySchema, TPostUserBody } from "@/models/User/schemas";
import pages from "@/pages";
import pojo from "@/utils/pojo";


/**
 * Called to attempt a sign in (when called with link = undefined or false), account link (when called with link = true), or session update (when called without data)
 * @param data (Optional) The data to use for the sign in attempt
 * @returns The updated session
 */
export async function handleSignIn(data?: TPostUserBody) {
  const ctx = cookies();

  const currSession = await auth(ctx).session();
  let userId = currSession.user?.id;

  if (data) {
    const { link, ...credentials } = await PostUserBodySchema.validate(data);

    const user = link
      ? await _handleLinkAccount(ctx, credentials)
      : await _handleCheckAccount(ctx, credentials);

    userId = user._id.toString();
  }

  const newSession = await _updateAuth(ctx, userId);

  if (!isEqual(currSession, newSession))
    revalidatePath(pages.api.session);

  return pojo(newSession);
}


export async function signOut() {
  const session = await auth(cookies()).session();
  session.destroy();

  revalidatePath(pages.root, "layout");
  revalidatePath(pages.api.session);

  return;
}