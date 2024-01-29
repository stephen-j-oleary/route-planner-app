import { InferType, object } from "yup";
import { string } from "yup";

import Account from "@/models/Account";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { NotFoundError } from "@/utils/ApiErrors";


const handler = nextConnect();


const ApiGetUserAccountsSchema = object({
  query: object({
    provider: string().optional(),
  }),
});
export type ApiGetUserAccountsQuery = InferType<typeof ApiGetUserAccountsSchema>["query"];
export type ApiGetUserAccountsResponse = Awaited<ReturnType<typeof handleGetUserAccounts>>;

/** Gets the accounts (full objects) for the authorized user */
export async function handleGetUserAccounts(query: ApiGetUserAccountsQuery & { userId: string }) {
  return await Account.find(query).lean().exec();
}

handler.get(
  authorization({ isUser: true }),
  validation(ApiGetUserAccountsSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserAccountsSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;

    const accounts = await handleGetUserAccounts({ ...query, userId: userId! });

    return res.status(200).json(accounts satisfies NonNullable<ApiGetUserAccountsResponse>);
  }
);


const ApiDeleteUserAccountsSchema = object({
  query: object({
    provider: string().optional(),
  }),
});
export type ApiDeleteUserAccountsQuery = InferType<typeof ApiDeleteUserAccountsSchema>["query"];
export type ApiDeleteUserAccountsResponse = Awaited<ReturnType<typeof handleDeleteUserAccounts>>;

export async function handleDeleteUserAccounts(query: ApiDeleteUserAccountsQuery & { userId: string }) {
  return await Account.deleteMany(query);
}

handler.delete(
  authorization({ isUser: true }),
  validation(ApiDeleteUserAccountsSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiDeleteUserAccountsSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;

    const { deletedCount } = await handleDeleteUserAccounts({ ...query, userId: userId! });
    if (deletedCount === 0) throw new NotFoundError();

    res.status(204).end();
  }
);

export default handler;