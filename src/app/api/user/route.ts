import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InferType, object } from "yup";
import { string } from "yup";

import Account from "@/models/Account";
import User from "@/models/User";
import { PostUserBodySchema } from "@/models/User/schemas";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import { auth } from "@/utils/auth/server";
import connectMongoose from "@/utils/connectMongoose";
import { fromMongoose } from "@/utils/mongoose";


export type ApiGetUserResponse = Awaited<ReturnType<typeof handleGetUserById>>;
export async function handleGetUserById(id: string) {
  await connectMongoose();

  return await User.findById(id).lean().exec();
}

export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    const session = await auth(cookies());
    const { userId } = session;
    if (!userId) throw new ApiError(401, "Not authorized");

    const user = await handleGetUserById(userId);
    if (!user) throw new ApiError(404, "User not found");

    return NextResponse.json(user);
  }
);


export const POST: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const body = await PostUserBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    await connectMongoose();

    // Find or create the user
    const user = (
      await User.findOne({ email: body.email }).lean().exec()
      ?? (await User.create({ email: body.email })).toJSON()
    );
    if (!user) throw new ApiError(500, "Failed to create user");
    if (!user.emailVerified) await EmailVerifier().send(user, "welcome");

    const accounts = await Account.find({ userId: user._id }).exec();
    const credentialsAccount = accounts.find(acc => acc.type === "credentials");
    const session = await auth(cookies());
    const authEmail = session?.email;

    if (credentialsAccount) {
      const credentialsOk = await credentialsAccount.checkCredentials({ email: body.email, password: body.password });
      if (!credentialsOk) throw new ApiError(403, "Invalid credentials");
      return fromMongoose(user);
    }

    if (accounts.length && authEmail !== body.email) throw new ApiError(500, "Account link failed");

    const account = await Account.create({
      type: "credentials",
      provider: "credentials",
      userId: user._id,
      credentials_email: body.email,
      credentials_password: body.password,
    });
    if (!account) throw new ApiError(500, "Account creation failed");

    return NextResponse.json(fromMongoose(user));
  }
);


const ApiPatchUserBodySchema = object()
  .shape({
    name: string().optional(),
    image: string().optional(),
  })
  .required()
  .noUnknown();

export type ApiPatchUserBody = InferType<typeof ApiPatchUserBodySchema>;
export type ApiPatchUserResponse = Awaited<ReturnType<typeof PATCH>>;

export const PATCH: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    const body = await ApiPatchUserBodySchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    await connectMongoose();

    const user = await User.findByIdAndUpdate(userId, body).lean().exec();
    if (!user) throw new ApiError(404, "User not found");

    return NextResponse.json(user);
  }
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    const { userId } = await auth(cookies());
    if (!userId) throw new ApiError(401, "Not authorized");

    await User.findByIdAndDelete(userId).lean().exec();

    return new NextResponse(null, { status: 204 });
  }
);