import { getServerSession } from "next-auth/next";

import { authOptions } from "@/pages/api/auth/[...nextauth]";


export async function getAuthSession(req, res) {
  const session = await getServerSession(req, res, authOptions);
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