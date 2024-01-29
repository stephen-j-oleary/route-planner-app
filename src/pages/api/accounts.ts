import { InferType, object } from "yup";
import { string } from "yup";

import Account, { accountPublicFields } from "@/models/Account";
import nextConnect from "@/nextConnect";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";


const handler = nextConnect();


const ApiGetAccountsSchema = object({
  query: object({
    userId: string().required(),
    provider: string().optional(),
  }),
});
export type ApiGetAccountsQuery = InferType<typeof ApiGetAccountsSchema>["query"];
export type ApiGetAccountsResponse = Pick<Awaited<ReturnType<typeof handleGetAccounts>>[number], typeof accountPublicFields[number]>[];

/** Gets the accounts (public fields only) for the passed userId */
export async function handleGetAccounts(query: ApiGetAccountsQuery) {
  return (await Account.find(query, accountPublicFields).lean().exec()) || [];
}

handler.get(
  validation(ApiGetAccountsSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetAccountsSchema>;

    const accounts = await handleGetAccounts(query);

    return res.status(200).json(accounts satisfies NonNullable<ApiGetAccountsResponse>);
  }
);


export default handler;