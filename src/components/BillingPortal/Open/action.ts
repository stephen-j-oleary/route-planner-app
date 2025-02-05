"use server";

import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

import { postUserBillingPortal } from "@/app/api/user/billingPortal/actions";
import pages from "@/pages";


export default async function openBillingPortal(prevState: unknown, formData: FormData) {
  try {
    const billingPortal = await postUserBillingPortal({ return_url: formData.get("return_url")?.toString() ?? pages.account.root })

    redirect(billingPortal.url);
  }
  catch (err) {
    if (isRedirectError(err)) throw err;

    console.error(err);
    return { error: err instanceof Error ? err.message : "An error occurred. Please try again" };
  }
}