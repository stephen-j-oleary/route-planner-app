import { User } from "next-auth";
import { getServerSession } from "next-auth/next";

import { getNextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { handleGetUser } from "@/pages/api/user";
import { NextRequest, NextResponse } from "@/types/next";
import { fromMongoose } from "@/utils/mongoose";


export async function getAuthSession(req: NextRequest, res: NextResponse) {
  return await getServerSession(req, res, getNextAuthOptions(req, res));
}

export async function getAuthUser(req: NextRequest, res: NextResponse) {
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) return null;

  const user = await handleGetUser(session?.user?.id);
  if (!user) return null;
  return fromMongoose<User>(user);
}