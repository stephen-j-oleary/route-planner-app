import { InferType, object, string } from "yup";

import { handleGetUser } from "..";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { NotFoundError } from "@/utils/ApiErrors";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose";


const handler = nextConnect();


export const ApiGetVerifyUserSchema = object({
  query: object({
    code: string().required(),
  }),
});
export type ApiGetVerifyUserQuery = InferType<typeof ApiGetVerifyUserSchema>["query"];
export type ApiGetVerifyUserResponse = Awaited<ReturnType<typeof handleGetVerifyUser>>;

export async function handleGetVerifyUser(userId: string, code: string | undefined) {
  const MAIL_FROM = process.env.LOOP_MAIL_FROM;
  if (!MAIL_FROM) throw new Error("Missing mail from");

  const user = await handleGetUser(userId);
  if (!user) return false;
  if (user.emailVerified) throw new Error("User already verified");
  if (!code) return false;

  return await EmailVerifier({
    dbConnect: connectMongoose(),
    models: {
      User,
      VerificationToken,
    },
    mailFrom: MAIL_FROM,
  }).verify(user, code);
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