import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InferType, object, string } from "yup";

import Account from "@/models/Account";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth/server";
import connectMongoose from "@/utils/connectMongoose";


const ApiGetUserAccountsQuerySchema = object()
  .shape({
    provider:
      string()
        .typeError("Invalid provider")
        .optional(),
  })
  .optional()
  .noUnknown();
export type ApiGetUserAccountsQuery = InferType<typeof ApiGetUserAccountsQuerySchema>;
export type ApiGetUserAccountsResponse = Awaited<ReturnType<typeof handleGetUserAccounts>>;

/** Gets the accounts (full objects) for the authorized user */
export async function handleGetUserAccounts(query: ApiGetUserAccountsQuery & { userId: string }) {
  await connectMongoose();

  return await Account.find(query).lean().exec();
}

export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetUserAccountsQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const session = await auth(cookies());
    const { userId } = session;
    if (!userId) throw new ApiError(401, "User required");

    const accounts = await handleGetUserAccounts({ ...query, userId });

    return NextResponse.json(accounts);
  }
);


const ApiDeleteUserAccountsQuerySchema = object()
  .shape({
    provider: string()
      .typeError("Invalid provider")
      .optional(),
  })
  .optional()
  .noUnknown();
export type ApiDeleteUserAccountsQuery = InferType<typeof ApiDeleteUserAccountsQuerySchema>;
export type ApiDeleteUserAccountsResponse = Awaited<ReturnType<typeof handleDeleteUserAccounts>>;

export async function handleDeleteUserAccounts(query: ApiDeleteUserAccountsQuery & { userId: string }) {
  await connectMongoose();

  return await Account.deleteMany(query);
}

export const DELETE: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiDeleteUserAccountsQuerySchema
      .validate(req.nextUrl.searchParams)
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const session = await auth(cookies());
    const { userId } = session;
    if (!userId) throw new ApiError(401, "User required");

    await handleDeleteUserAccounts({ ...query, userId });

    return new NextResponse(null, { status: 204 });
  }
);