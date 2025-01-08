import { NextRequest } from "next/server";

import { middleware as currentPathMiddleware } from "@/utils/currentPath";


export default async function middleware(req: NextRequest) {
  const res = await currentPathMiddleware(req);
  return res;
}