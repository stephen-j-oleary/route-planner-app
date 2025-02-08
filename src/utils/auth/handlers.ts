import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AppRouteHandler } from "@/types/next";
import { apiErrorHandler } from "@/utils/apiError";
import auth from "@/utils/auth";
import { handleSignIn, signOut } from "@/utils/auth/actions";
import pojo from "@/utils/pojo";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => NextResponse.json(
    pojo(await auth(cookies()).session())
  )
);


export const PATCH: AppRouteHandler = apiErrorHandler(
  async (req) => NextResponse.json(
    await handleSignIn(await req.json().catch(() => undefined))
  )
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    await signOut();

    return new NextResponse(null, { status: 204 });
  }
);