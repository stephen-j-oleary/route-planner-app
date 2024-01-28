import { InferType, number, object } from "yup";
import { string } from "yup";

import Account, { accountPublicFields } from "@/models/Account";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { handleGetUserById } from "@/pages/api/users/[id]";
import { ApiError, AuthError, ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();


const ApiGetAccountsSchema = object({
  query: object({
    userId: string().optional(),
    provider: string().optional(),
  }),
});
export type ApiGetAccountsQuery = InferType<typeof ApiGetAccountsSchema>["query"];
export type ApiGetAccountsAuthorizedResponse = Awaited<ReturnType<typeof handleGetAccounts>>;
export type ApiGetAccountsUnauthorizedResponse = Pick<ApiGetAccountsAuthorizedResponse[number], typeof accountPublicFields[number]>[];
export type ApiGetAccountsResponse =
  | ApiGetAccountsAuthorizedResponse
  | ApiGetAccountsUnauthorizedResponse;

export async function handleGetAccounts(query: ApiGetAccountsQuery) {
  const accounts = await Account.find(query).lean().exec();
  return accounts || [];
}

export async function handleGetAccountsUnauthorized(query: ApiGetAccountsQuery) {
  const accounts = await Account.find(query, accountPublicFields).lean().exec();
  return accounts || [];
}

handler.get(
  authorization({}), // Populates the authorized local
  validation(ApiGetAccountsSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetAccountsSchema>;
    const authorized = req.locals.authorized as AuthorizedType;
    const { userId } = query;

    const isAuthorized = !!authorized.userId && (userId === authorized.userId || !userId);

    const accounts = await (
      isAuthorized
        ? handleGetAccounts({ ...query, userId: authorized.userId })
        : handleGetAccountsUnauthorized(query)
    );

    return res.status(200).json(accounts);
  }
);


const ApiPostAccountSchema = object({
  body: object({
    id: string().optional(),
    userId: string().required(),
    type: string().required().oneOf(["oauth", "email", "credentials"]),
    provider: string().required(),
    providerAccountId: string().required(),
    refresh_token: string().optional(),
    access_token: string().optional(),
    expires_at: number().optional(),
    token_type: string().optional(),
    scope: string().optional(),
    id_token: string().optional(),
    session_state: string().optional(),
    oauth_token_secret: string().optional(),
    oauth_token: string().optional(),
    credentials_email: string().optional(),
    credentials_password: string().optional(),
  }),
});
export type ApiPostAccountBody = InferType<typeof ApiPostAccountSchema>["body"];
export type ApiPostAccountResponse = Awaited<ReturnType<typeof handlePostAccount>>;

export async function handlePostAccount({ id, ...data }: ApiPostAccountBody) {
  return await Account.create({ _id: id, ...data });
}

handler.post(
  authorization({}), // Populates the authorized local
  validation(ApiPostAccountSchema),
  async (req, res) => {
    const { body } = req.locals.validated as ValidatedType<typeof ApiPostAccountSchema>;
    const authorized = req.locals.authorized as AuthorizedType;
    const { userId } = body;

    // Check if the user for userId exists
    const user = await handleGetUserById(userId);
    if (!user) throw { status: 409, message: "User resource does not exist" };

    // Get the accounts for the userId
    const accounts = await handleGetAccounts({ userId });

    // Require authorization if any accounts already exist
    if (accounts.length && (!authorized.userId || !compareMongoIds(authorized.userId, userId))) throw new AuthError();

    // Create new account
    const newAccount = await handlePostAccount(body);
    if (!newAccount) throw new ApiError({ status: 500 });

    return res.status(201).json(newAccount);
  }
);


const ApiDeleteAccountSchema = object({
  query: object({
    userId: string().when("email", {
      is: "",
      then: schema => schema.required(),
    }),
    email: string().when("userId", {
      is: "",
      then: schema => schema.required(),
    }),
  }).required(),
});
export type ApiDeleteAccountsQuery = InferType<typeof ApiDeleteAccountSchema>["query"];
export type ApiDeleteAccountsResponse = Awaited<ReturnType<typeof handleDeleteAccounts>>;

export async function handleDeleteAccounts(query: ApiDeleteAccountsQuery) {
  return await Account.deleteMany(query);
}

handler.delete(
  authorization({ isUser: true }),
  validation(ApiDeleteAccountSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiDeleteAccountSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;

    // If querying by userId, confirm same as authorized userId
    if (query.userId && query.userId !== userId) throw new ForbiddenError();

    const { deletedCount } = await handleDeleteAccounts({
      ...query,
      userId, // Query by authorized userId
    });
    if (deletedCount === 0) throw new NotFoundError();

    res.status(204).end();
  }
);

export default handler;