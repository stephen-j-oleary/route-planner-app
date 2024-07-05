import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest, NextResponse } from "next/server";


export type AuthData = {
  userId?: string,
  email?: string,
  image?: string,
  customerId?: string,
  emailVerified?: boolean,
};

export type AuthContext =
  | ReturnType<() => ReadonlyRequestCookies>
  | { req: NextRequest, res: NextResponse };


export type SignInAccountData = {
  email: string,
  password: string,
};