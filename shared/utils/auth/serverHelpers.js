import { getServerSession } from "next-auth/next";

import { getNextAuthOptions } from "@/pages/api/auth/[...nextauth]";


export async function getAuthSession(req, res) {
  const session = await getServerSession(req, res, getNextAuthOptions(req, res));
  return session;
}

export async function getAuthScope(req, res) {
  const session = await getAuthSession(req, res);
  return session ? "private" : "public";
}

export async function getAuthUser(req, res) {
  const session = await getAuthSession(req, res);
  return session?.user;
}