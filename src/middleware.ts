import { NextRequest } from "next/server";

import { middleware as absoluteMiddleware } from "@/utils/absolute";


export default async function middleware(req: NextRequest) {
  const res = await absoluteMiddleware(req);
  return res;
}