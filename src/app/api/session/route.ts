import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AppRouteHandler } from "@/types/next";
import { apiErrorHandler } from "@/utils/apiError";
import { auth, signOut, updateAuth } from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => NextResponse.json(
    await auth(cookies())
  )
);


export const PATCH: AppRouteHandler = apiErrorHandler(
  async (req) => NextResponse.json(
    await updateAuth(await req.json(), cookies())
  )
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    await signOut();

    return new NextResponse(null, { status: 204 });
  }
);