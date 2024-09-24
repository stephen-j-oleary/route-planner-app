import { NextRequest, NextResponse } from "next/server";


export const CURRENT_PATH_HEADER_KEY = "x-next-url";


export default async function authMiddleware(req: NextRequest, res?: NextResponse) {
  const _res = res || NextResponse.next();
  _res.headers.set(CURRENT_PATH_HEADER_KEY, req.nextUrl.toString());
  return _res;
}