import { InferType, object, string } from "yup";

import Account, { accountPublicFields } from "@/models/Account";
import connectMongoose from "@/utils/connectMongoose";


export const ApiGetAccountsQuerySchema = object()
  .shape({
    userId: string()
      .typeError("Invalid user id")
      .required("Missing user id"),
    provider: string()
      .typeError("Invalid provider")
      .optional(),
  })
  .noUnknown();
export type ApiGetAccountsQuery = InferType<typeof ApiGetAccountsQuerySchema>;
export type ApiGetAccountsResponse = Pick<Awaited<ReturnType<typeof handleGetAccounts>>[number], typeof accountPublicFields[number]>[];

/** Gets the accounts (public fields only) for the passed userId */
export async function handleGetAccounts(query: ApiGetAccountsQuery) {
  await connectMongoose();

  return await Account.find(query, accountPublicFields).lean().exec();
}