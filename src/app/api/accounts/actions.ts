"use server";

import { ApiGetAccountsQuery } from "@/app/api/accounts/schemas";
import Account, { accountPublicFields } from "@/models/Account";
import connectMongoose from "@/utils/connectMongoose";


export async function getAccounts(query: ApiGetAccountsQuery) {
  await connectMongoose();

  return await Account.find(query, accountPublicFields).lean().exec();
}