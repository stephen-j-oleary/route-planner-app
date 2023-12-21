import { User } from "next-auth";
import { getServerSession } from "next-auth/next";

import { getNextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { handleGetCustomerById } from "@/pages/api/pay/customers/[customerId]";
import { handleGetUserById } from "@/pages/api/users/[id]";
import { NextRequest, NextResponse } from "@/types/next";
import { fromMongoose } from "@/utils/mongoose";


export async function getAuthSession(req: NextRequest, res: NextResponse) {
  return await getServerSession(req, res, getNextAuthOptions(req, res));
}

export async function getAuthScope(req: NextRequest, res: NextResponse) {
  const session = await getAuthSession(req, res);
  return session ? "private" : "public";
}

export async function getAuthUser(req: NextRequest, res: NextResponse) {
  const session = await getAuthSession(req, res);
  if (!session?.user?.id) return null;

  const user = await handleGetUserById(session?.user?.id);
  if (!user) return null;
  return fromMongoose<User>(user);
}

export async function getAuthCustomer(req: NextRequest, res: NextResponse) {
  const authUser = await getAuthUser(req, res);
  const id = authUser?.id;
  let customerId = authUser?.customerId;
  if (!id && !customerId) return undefined;

  customerId ??= (await handleGetUserById(id))?.customerId;
  if (!customerId) return undefined;

  return await handleGetCustomerById(customerId);
}