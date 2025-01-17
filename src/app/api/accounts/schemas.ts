import { InferType, object, string } from "yup";

import { getAccounts } from "./actions";
import { accountPublicFields } from "@/models/Account";


export const ApiGetAccountsQuerySchema = object()
  .shape({
    userId: string()
      .typeError("Invalid user id")
      .when("userEmail", {
        is: (val: unknown) => !val,
        then: schema => schema.required("Missing user id or user email"),
      }),
    userEmail: string()
      .typeError("Invalid user email")
      .when("userId", {
        is: (val: unknown) => !val,
        then: schema => schema.required("Missing user id or user email"),
      }),
    provider: string()
      .typeError("Invalid provider")
      .optional(),
  }, [["userId", "userEmail"]])
  .noUnknown();
export type ApiGetAccountsQuery = InferType<typeof ApiGetAccountsQuerySchema>;
export type ApiGetAccountsResponse = Pick<Awaited<ReturnType<typeof getAccounts>>[number], typeof accountPublicFields[number]>[];