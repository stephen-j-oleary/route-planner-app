import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { handleGetUserById } from "@/pages/api/users/[id]";
import { AuthError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";


export default async function isCustomerAuthenticated(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  const authUser = await getAuthUser(req, res);
  if (authUser?.customerId) return next();

  const user = await handleGetUserById(authUser?.id);
  if (user?.customerId) return next();

  throw new AuthError("Missing or invalid customer authentication");
}