"use server";

import { revalidatePath } from "next/cache";

import { ApiPatchUserAccountByIdBody } from "./schemas";
import Account from "@/models/Account";
import connectMongoose from "@/utils/connectMongoose";
import pages from "pages";


export async function getUserAccountById(id: string) {
  await connectMongoose();

  return await Account.findById(id).lean().exec();
}


export async function patchUserAccountById(id: string, data: ApiPatchUserAccountByIdBody) {
  await connectMongoose();

  const res = await Account.findByIdAndUpdate(id, data).lean().exec();

  revalidatePath(pages.api.userAccounts);

  return res;
}


export async function deleteUserAccountById(id: string) {
  await connectMongoose();

  const res = await Account.findByIdAndDelete(id).lean().exec();

  revalidatePath(pages.api.userAccounts);

  return res;
}