import { getServerSession } from "next-auth/next";

import { getNextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { NextRequest, NextResponse } from "@/types/next";


export async function getAuthSession(req: NextRequest, res: NextResponse) {
  return await getServerSession(req, res, getNextAuthOptions(req, res));
}

export async function getAuthScope(req: NextRequest, res: NextResponse) {
  const session = await getAuthSession(req, res);
  return session ? "private" : "public";
}

export async function getAuthUser(req: NextRequest, res: NextResponse) {
  const session = await getAuthSession(req, res);
  return session?.user;
}