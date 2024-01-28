import { InferType, object } from "yup";
import { string } from "yup";

import Account from "@/models/Account";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { AuthError, ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();


export const ApiGetAccountByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiGetAccountByIdQuery = InferType<typeof ApiGetAccountByIdSchema>["query"];
export type ApiGetAccountByIdResponse = Awaited<ReturnType<typeof handleGetAccountById>>;

export async function handleGetAccountById(id: string) {
  return await Account.findById(id).lean().exec();
}

handler.get(
  authorization({ isUser: true }),
  validation(ApiGetAccountByIdSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetAccountByIdSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the account
    const account = await handleGetAccountById(id);
    if (!account) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, account.userId)) throw new ForbiddenError();

    res.status(200).json(account satisfies NonNullable<ApiGetAccountByIdResponse>);
  }
);


const ApiPatchAccountSchema = object({
  query: object({
    id: string().required(),
  }),
  body: object({
    credentials_email: string().required(),
    credentials_password: string().required(),
  }),
});
export type ApiPatchAccountQuery = InferType<typeof ApiPatchAccountSchema>["query"];
export type ApiPatchAccountBody = InferType<typeof ApiPatchAccountSchema>["body"];
export type ApiPatchAccountResponse = Awaited<ReturnType<typeof handlePatchAccountById>>;

export async function handlePatchAccountById(id: string, data: ApiPatchAccountBody) {
  return await Account.findByIdAndUpdate(id, data).lean().exec();
}

handler.patch(
  authorization({ isUser: true }),
  validation(ApiPatchAccountSchema),
  async (req, res) => {
    const { query, body } = req.locals.validated as ValidatedType<typeof ApiPatchAccountSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the account
    const account = await handleGetAccountById(id);
    if (!account) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, account.userId)) throw new ForbiddenError();

    // Update the account
    const updatedAccount = await handlePatchAccountById(id, body);
    if (!updatedAccount) throw new NotFoundError();

    res.status(200).json(updatedAccount satisfies NonNullable<ApiPatchAccountResponse>);
  }
);


const ApiDeleteAccountSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiDeleteAccountQuery = InferType<typeof ApiDeleteAccountSchema>["query"];
export type ApiDeleteAccountRepsonse = Awaited<ReturnType<typeof handleDeleteAccount>>;

export async function handleDeleteAccount(id: string) {
  return await Account.findByIdAndDelete(id).lean().exec();
}

handler.delete(
  authorization({ isUser: true }),
  validation(ApiDeleteAccountSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiDeleteAccountSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the account
    const account = await handleGetAccountById(id);
    if (!account) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, account.userId)) throw new AuthError();

    // Delete the account
    const deletedAccount = await handleDeleteAccount(id);
    if (!deletedAccount) throw new NotFoundError();

    res.status(204).end();
  }
);

export default handler;