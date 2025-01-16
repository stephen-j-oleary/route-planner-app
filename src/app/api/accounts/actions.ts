"use server";

import { ApiGetAccountsQuery } from "@/app/api/accounts/schemas";
import { getUsers } from "@/app/api/users/actions";
import Account, { accountPublicFields } from "@/models/Account";
import connectMongoose from "@/utils/connectMongoose";


export async function getAccounts({ userEmail, ...query }: ApiGetAccountsQuery) {
  await connectMongoose();

  if (userEmail) {
    const [user] = await getUsers({ email: userEmail });
    if (!user) return [];

    query.userId = user._id.toString();
  }

  return await Account.find(query, accountPublicFields).lean().exec();
}