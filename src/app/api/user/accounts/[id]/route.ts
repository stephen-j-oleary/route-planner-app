import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteUserAccountById, getUserAccountById, patchUserAccountById } from "./actions";
import { ApiPatchUserAccountByIdBodySchema } from "./schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";
import compareMongoIds from "@/utils/compareMongoIds";


export const GET: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {} } = await auth(cookies()).api();
    if (!userId) throw new ApiError(401, "User required");

    const account = await getUserAccountById(params.id);
    if (!account) throw new ApiError(404, "Not found");

    if (!compareMongoIds(userId, account.userId)) throw new ApiError(403, "User not authorized");

    return NextResponse.json(account);
  }
);


export const PATCH: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const body = await ApiPatchUserAccountByIdBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    const { user: { id: userId } = {} } = await auth(cookies()).api();
    if (!userId) throw new ApiError(401, "User required");

    const account = await getUserAccountById(params.id);
    if (!account) throw new ApiError(404, "Not found");

    if (!compareMongoIds(userId, account.userId)) throw new ApiError(403, "User not authorized");

    const updatedAccount = await patchUserAccountById(params.id, body);

    return NextResponse.json(updatedAccount);
  }
);


export const DELETE: AppRouteHandler<{ id: string }> = apiErrorHandler(
  async (req, { params }) => {
    const { user: { id: userId } = {} } = await auth(cookies()).api();
    if (!userId) throw new ApiError(401, "User required");

    const account = await getUserAccountById(params.id);
    if (!account) throw new ApiError(404, "Not found");

    if (!compareMongoIds(userId, account.userId)) throw new ApiError(403, "User not authorized");

    await deleteUserAccountById(params.id);

    return new NextResponse(null, { status: 204 });
  }
);