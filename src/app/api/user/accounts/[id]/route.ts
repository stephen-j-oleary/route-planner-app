import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InferType, object } from "yup";
import { string } from "yup";

import Account from "@/models/Account";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import compareMongoIds from "@/utils/compareMongoIds";
import connectMongoose from "@/utils/connectMongoose";


export type ApiGetUserAccountByIdResponse = Awaited<ReturnType<typeof handleGetUserAccountById>>;

export async function handleGetUserAccountById(id: string) {
  await connectMongoose();

  return await Account.findById(id).lean().exec();
}

export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");

    const account = await handleGetUserAccountById(params.id);
    if (!account) throw new ApiError(404, "Not found");

    if (!compareMongoIds(userId, account.userId)) throw new ApiError(403, "User not authorized");

    return NextResponse.json(account);
  }
);


const ApiPatchUserAccountByIdBodySchema = object()
  .shape({
    credentials_email: string().required(),
    credentials_password: string().required(),
  })
  .noUnknown();
export type ApiPatchUserAccountByIdBody = InferType<typeof ApiPatchUserAccountByIdBodySchema>;
export type ApiPatchUserAccountByIdResponse = Awaited<ReturnType<typeof handlePatchUserAccountById>>;

export async function handlePatchUserAccountById(id: string, data: ApiPatchUserAccountByIdBody) {
  await connectMongoose();

  return await Account.findByIdAndUpdate(id, data).lean().exec();
}

export const PATCH: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const body = await ApiPatchUserAccountByIdBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");

    const account = await handleGetUserAccountById(params.id);
    if (!account) throw new ApiError(404, "Not found");

    if (!compareMongoIds(userId, account.userId)) throw new ApiError(403, "User not authorized");

    const updatedAccount = await handlePatchUserAccountById(params.id, body);

    return NextResponse.json(updatedAccount);
  }
);


export type ApiDeleteUserAccountByIdResponse = Awaited<ReturnType<typeof handleDeleteUserAccountById>>;

export async function handleDeleteUserAccountById(id: string) {
  await connectMongoose();

  return await Account.findByIdAndDelete(id).lean().exec();
}

export const DELETE: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "User required");

    const account = await handleGetUserAccountById(params.id);
    if (!account) throw new ApiError(404, "Not found");

    if (!compareMongoIds(userId, account.userId)) throw new ApiError(403, "User not authorized");

    await handleDeleteUserAccountById(params.id);

    return new NextResponse(null, { status: 204 });
  }
);