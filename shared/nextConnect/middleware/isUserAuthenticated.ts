import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { AuthError } from "@/shared/utils/ApiErrors";
import { getAuthUser } from "@/shared/utils/auth/serverHelpers";


export default async function isUserAuthenticated(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  const authUser = await getAuthUser(req, res);
  if (!authUser?.id) throw new AuthError("Missing or invalid user authentication");

  next();
}