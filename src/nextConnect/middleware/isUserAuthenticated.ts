import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import { AuthError } from "@/utils/ApiErrors";
import { getAuthUser } from "@/utils/auth/serverHelpers";


export default async function isUserAuthenticated(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  const authUser = await getAuthUser(req, res);
  if (!authUser?.id) throw new AuthError("Missing or invalid user authentication");

  next();
}