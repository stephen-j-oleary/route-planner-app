"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { postUserBillingPortal } from "@/app/api/user/billingPortal/actions";
import { auth } from "@/utils/auth";
import pages from "pages";


export default async function openBillingPortal(prevState: unknown, formData: FormData) {
  const { customerId } = await auth(cookies());
  if (!customerId) return { error: "Customer not found" };

  const billingPortal = await postUserBillingPortal({ customer: customerId, return_url: formData.get("return_url")?.toString() ?? pages.account.root });

  redirect(billingPortal.url);
}