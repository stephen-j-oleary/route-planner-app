import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { AuthError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";


export default async function isCustomerAuthenticated(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  const authUser = await getAuthUser(req, res);
  if (!authUser?.customerId) throw new AuthError("Missing or invalid customer authentication");

  next();
}