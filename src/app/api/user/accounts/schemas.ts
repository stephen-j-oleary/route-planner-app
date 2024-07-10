import { InferType, object, string } from "yup";

import { deleteUserAccounts, getUserAccounts } from "./actions";


export const ApiGetUserAccountsQuerySchema = object()
  .shape({
    provider:
      string()
        .typeError("Invalid provider")
        .optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserAccountsQuery = InferType<typeof ApiGetUserAccountsQuerySchema>;
export type ApiGetUserAccountsResponse = Awaited<ReturnType<typeof getUserAccounts>>;


export const ApiDeleteUserAccountsQuerySchema = object()
  .shape({
    provider: string()
      .typeError("Invalid provider")
      .optional(),
  })
  .optional()
  .noUnknown();
export type ApiDeleteUserAccountsQuery = InferType<typeof ApiDeleteUserAccountsQuerySchema>;
export type ApiDeleteUserAccountsResponse = Awaited<ReturnType<typeof deleteUserAccounts>>;