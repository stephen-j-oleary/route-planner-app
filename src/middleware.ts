import { NextRequest } from "next/server";

import authMiddleware from "@/utils/auth/middleware";


export default async function middleware(req: NextRequest) {
  const res = await authMiddleware(req);
  return res;
}