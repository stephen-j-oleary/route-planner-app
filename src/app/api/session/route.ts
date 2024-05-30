import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AppRouteHandler } from "@/types/next";
import { apiErrorHandler } from "@/utils/apiError";
import { auth, removeAuth } from "@/utils/auth";


export const GET: AppRouteHandler = apiErrorHandler(
  async () => {
    const session = await auth(cookies());

    return NextResponse.json(session);
  }
);


export const DELETE: AppRouteHandler = apiErrorHandler(
  async () => {
    await removeAuth(cookies());

    return new NextResponse(null, { status: 204 });
  }
);