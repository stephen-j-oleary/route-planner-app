import { NextApiRequest, NextApiResponse } from "next/types";
import { getServerSession } from "next-auth/next";

import { getNextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { handleGetUser } from "@/pages/api/user";
import { NextRequest, NextResponse } from "@/types/next";


export async function getAuthSession(req: NextRequest | NextApiRequest, res: NextResponse | NextApiResponse) {
  return await getServerSession(req, res, getNextAuthOptions(req, res));
}

export async function getAuthUser(req: NextRequest | NextApiRequest, res: NextResponse | NextApiResponse) {
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) return null;

  const user = await handleGetUser(session?.user?.id);
  return user || null;
}