import { getServerSession } from "next-auth/next";

import { getNextAuthOptions } from "@/pages/api/auth/[...nextauth]";
import { handleGetCustomerById } from "@/pages/api/pay/customers/[customerId]";
import { handleGetUserById } from "@/pages/api/users/[id]";
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

  return await handleGetUserById(session?.user?._id);
}

export async function getAuthCustomer(req: NextRequest, res: NextResponse) {
  const authUser = await getAuthUser(req, res);
  let { _id, customerId } = authUser || {};
  if (!_id && !customerId) return undefined;

  customerId ??= (await handleGetUserById(_id))?.customerId;
  if (!customerId) return undefined;

  return await handleGetCustomerById(customerId);
}