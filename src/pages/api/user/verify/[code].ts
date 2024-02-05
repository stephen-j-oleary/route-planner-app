import { InferType, object, string } from "yup";

import { handleGetUser } from "..";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { NotFoundError } from "@/utils/ApiErrors";
import EmailVerification from "@/utils/auth/EmailVerification";


const handler = nextConnect();


export const ApiGetVerifyUserSchema = object({
  query: object({
    code: string().required(),
  }),
});
export type ApiGetVerifyUserQuery = InferType<typeof ApiGetVerifyUserSchema>["query"];
export type ApiGetVerifyUserResponse = Awaited<ReturnType<typeof handleGetVerifyUser>>;

export async function handleGetVerifyUser(userId: string, code: string | undefined) {
  const user = await handleGetUser(userId);
  if (!user) return false;
  if (user.emailVerified) throw new Error("User already verified");
  if (!code) return false;

  return await EmailVerification.verify(user, code);
}

handler.get(
  authorization({ isUser: true }),
  validation(ApiGetVerifyUserSchema),
  async (req, res) => {
    const { userId } = req.locals.authorized as AuthorizedType;
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetVerifyUserSchema>;
    const { code } = query;

    const token = await handleGetVerifyUser(userId!, code);
    if (!token) throw new NotFoundError();

    return res.status(200).json(token);
  }
);


export default handler;