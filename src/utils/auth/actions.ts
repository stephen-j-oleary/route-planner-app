"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { auth } from ".";
import pages from "pages";


export async function signOut() {
  const session = await auth(cookies());
  session.destroy();

  revalidatePath(pages.root, "layout");

  return;
}