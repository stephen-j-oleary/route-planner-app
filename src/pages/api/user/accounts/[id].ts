import { InferType, object } from "yup";
import { string } from "yup";

import Account from "@/models/Account";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { AuthError, ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();


export const ApiGetUserAccountByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiGetUserAccountByIdQuery = InferType<typeof ApiGetUserAccountByIdSchema>["query"];
export type ApiGetUserAccountByIdResponse = Awaited<ReturnType<typeof handleGetUserAccountById>>;

export async function handleGetUserAccountById(id: string) {
  return await Account.findById(id).lean().exec();
}

handler.get(
  authorization({ isUser: true }),
  validation(ApiGetUserAccountByIdSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserAccountByIdSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the account
    const account = await handleGetUserAccountById(id);
    if (!account) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, account.userId)) throw new ForbiddenError();

    res.status(200).json(account satisfies NonNullable<ApiGetUserAccountByIdResponse>);
  }
);


const ApiPatchUserAccountByIdSchema = object({
  query: object({
    id: string().required(),
  }),
  body: object({
    credentials_email: string().required(),
    credentials_password: string().required(),
  }),
});
export type ApiPatchUserAccountByIdQuery = InferType<typeof ApiPatchUserAccountByIdSchema>["query"];
export type ApiPatchUserAccountByIdBody = InferType<typeof ApiPatchUserAccountByIdSchema>["body"];
export type ApiPatchUserAccountByIdResponse = Awaited<ReturnType<typeof handlePatchUserAccountById>>;

export async function handlePatchUserAccountById(id: string, data: ApiPatchUserAccountByIdBody) {
  return await Account.findByIdAndUpdate(id, data).lean().exec();
}

handler.patch(
  authorization({ isUser: true }),
  validation(ApiPatchUserAccountByIdSchema),
  async (req, res) => {
    const { query, body } = req.locals.validated as ValidatedType<typeof ApiPatchUserAccountByIdSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the account
    const account = await handleGetUserAccountById(id);
    if (!account) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, account.userId)) throw new ForbiddenError();

    // Update the account
    const updatedAccount = await handlePatchUserAccountById(id, body);
    if (!updatedAccount) throw new NotFoundError();

    res.status(200).json(updatedAccount satisfies NonNullable<ApiPatchUserAccountByIdResponse>);
  }
);


const ApiDeleteUserAccountByIdSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiDeleteUserAccountByIdQuery = InferType<typeof ApiDeleteUserAccountByIdSchema>["query"];
export type ApiDeleteUserAccountByIdResponse = Awaited<ReturnType<typeof handleDeleteUserAccountById>>;

export async function handleDeleteUserAccountById(id: string) {
  return await Account.findByIdAndDelete(id).lean().exec();
}

handler.delete(
  authorization({ isUser: true }),
  validation(ApiDeleteUserAccountByIdSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiDeleteUserAccountByIdSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get the account
    const account = await handleGetUserAccountById(id);
    if (!account) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, account.userId)) throw new AuthError();

    // Delete the account
    const deletedAccount = await handleDeleteUserAccountById(id);
    if (!deletedAccount) throw new NotFoundError();

    res.status(204).end();
  }
);

export default handler;