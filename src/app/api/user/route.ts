import { NextResponse } from "next/server";

import { deleteUser, getUserById, patchUser } from "./actions";
import Account from "@/models/Account";
import User from "@/models/User";
import { PostUserBodySchema, UserProfileSchema } from "@/models/User/schemas";
import pages from "@/pages";
import { AppRouteHandler } from "@/types/next";
import { ApiError, apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose";
import { fromMongoose } from "@/utils/mongoose";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    const { user: { id: userId } = {} } = await auth(pages.api.user).api();
    if (!userId) throw new ApiError(401, "Not authorized");

    const user = await getUserById(userId);
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
    if (!user.emailVerified) await EmailVerifier(user).send("welcome");

    const accounts = await Account.find({ userId: user._id }).exec();
    const credentialsAccount = accounts.find(acc => acc.type === "credentials");
    const session = await auth(pages.api.user).session();
    const authEmail = session?.user?.email;

    if (credentialsAccount) {
      const credentialsOk = await credentialsAccount.checkCredentials({ email: body.email, password: body.password });
      if (!credentialsOk) throw new ApiError(403, "Invalid credentials");
      return NextResponse.json(fromMongoose(user));
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


export const PATCH: AppRouteHandler = apiErrorHandler(
  async (req) => {
    const body = await UserProfileSchema
      .validate(await req.json())
      .catch(err => {
        throw new ApiError(400, err.message);
      });

    return NextResponse.json(
      await patchUser(body)
    );
  }
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    await deleteUser();

    return new NextResponse(null, { status: 204 });
  }
);