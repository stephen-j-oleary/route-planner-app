import { NextRequest } from "next/server";

import { middleware as currentPathMiddleware } from "@/utils/currentPath";


export default function middleware(req: NextRequest) {
  const res = currentPathMiddleware(req);
  return res;
}