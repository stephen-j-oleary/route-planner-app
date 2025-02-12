"use server";

import { ApiError } from "next/dist/server/api-utils";

import { ApiDeleteUserAccountsQuery, ApiGetUserAccountsQuery } from "./schemas";
import Account from "@/models/Account";
import pages from "@/pages";
import auth from "@/utils/auth";
import connectMongoose from "@/utils/connectMongoose";
import { fromMongoose } from "@/utils/mongoose";


/** Gets the accounts (full objects) for the authorized user */
export async function getUserAccounts(query: ApiGetUserAccountsQuery = {}) {
  const { user } = await auth(pages.api.userAccounts).api();
  if (!user?.id) throw new ApiError(403, "User not authorized");

  await connectMongoose();

  return fromMongoose(
    await Account.find({ userId: user.id, ...query }).lean().exec()
  );
}


export async function deleteUserAccounts(query: ApiDeleteUserAccountsQuery = {}) {
  const { user } = await auth(pages.api.userAccounts).api();
  if (!user?.id) throw new ApiError(403, "User not authorized");

  await connectMongoose();

  await Account.deleteMany({ userId: user.id, ...query });

  return;
}