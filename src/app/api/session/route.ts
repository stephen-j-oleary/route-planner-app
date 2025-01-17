import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AppRouteHandler } from "@/types/next";
import { apiErrorHandler } from "@/utils/apiError";
import { auth } from "@/utils/auth";
import { signIn, signOut } from "@/utils/auth/actions";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => NextResponse.json(
    await auth(cookies())
  )
);


export const PATCH: AppRouteHandler = apiErrorHandler(
  async () => NextResponse.json(
    await signIn()
  )
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    await signOut();

    return new NextResponse(null, { status: 204 });
  }
);