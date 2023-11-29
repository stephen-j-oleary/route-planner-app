import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { handleGetUserById } from "@/pages/api/users/[id]";
import { AuthError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";


export default async function isCustomerAuthenticated(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  const authUser = await getAuthUser(req, res);
  if (authUser?.customerId) return next();

  const user = await handleGetUserById(authUser?._id);
  if (user?.customerId) return next();

  throw new AuthError("Missing or invalid customer authentication");
}