import { NextResponse } from "next/server";
import { InferType, object, string } from "yup";

import User, { userPublicFields } from "@/models/User";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import connectMongoose from "@/utils/connectMongoose";


const ApiGetUsersQuerySchema = object()
  .shape({
    email: string()
      .typeError("Invalid email")
      .required("Missing email")
      .email("Invalid email"),
  })
  .noUnknown();
export type ApiGetUsersQuery = InferType<typeof ApiGetUsersQuerySchema>;
export type ApiGetUsersResponse = Pick<Awaited<ReturnType<typeof handleGetUsers>>[number], typeof userPublicFields[number]>[];

export async function handleGetUsers(query: ApiGetUsersQuery) {
  await connectMongoose();

  return await User.find(query, userPublicFields).exec();
}

export const GET: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const query = await ApiGetUsersQuerySchema
      .validate(Object.fromEntries(req.nextUrl.searchParams.entries()))
      .catch(err => {
        throw new ApiError(400, err);
      });

    const users = await handleGetUsers(query);

    return NextResponse.json(users);
  }
);