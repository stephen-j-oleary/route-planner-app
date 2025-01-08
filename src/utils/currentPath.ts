"use server";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const CURRENT_PATH_HEADER_KEY = "x-next-url";


export async function middleware(req: NextRequest, res?: NextResponse) {
  const _res = res || NextResponse.next();
  const currentPath = new URL(req.nextUrl.toString()).pathname;
  _res.headers.set(CURRENT_PATH_HEADER_KEY, currentPath);
  return _res;
}


export async function getCurrentPath() {
  return headers().get(CURRENT_PATH_HEADER_KEY) ?? "";
}