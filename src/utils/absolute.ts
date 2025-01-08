"use server";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const CURRENT_PATH_HEADER_KEY = "x-next-url";


export async function middleware(req: NextRequest, res?: NextResponse) {
  const _res = res || NextResponse.next();
  _res.headers.set(CURRENT_PATH_HEADER_KEY, req.nextUrl.toString());
  return _res;
}


export async function getBasePath() {
  return headers().get(CURRENT_PATH_HEADER_KEY) ?? "";
}

export async function toAbsolute(url: string) {
  if (!url.startsWith("/")) return url;

  const basePath = await getBasePath();
  return basePath + url;
}