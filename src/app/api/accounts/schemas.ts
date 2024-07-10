import { InferType, object, string } from "yup";

import { getAccounts } from "./actions";
import { accountPublicFields } from "@/models/Account";


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
export type ApiGetAccountsResponse = Pick<Awaited<ReturnType<typeof getAccounts>>[number], typeof accountPublicFields[number]>[];