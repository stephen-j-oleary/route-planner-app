"use server";

import { ApiDeleteUserAccountsQuery, ApiGetUserAccountsQuery } from "./schemas";
import Account from "@/models/Account";
import connectMongoose from "@/utils/connectMongoose";


/** Gets the accounts (full objects) for the authorized user */
export async function getUserAccounts(query: ApiGetUserAccountsQuery & { userId: string }) {
  await connectMongoose();

  return await Account.find(query).lean().exec();
}


export async function deleteUserAccounts(query: ApiDeleteUserAccountsQuery & { userId: string }) {
  await connectMongoose();

  return await Account.deleteMany(query);
}