import { boolean, InferType, object } from "yup";

import { handleGetUser } from "..";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose";


const handler = nextConnect();


export const ApiGetVerifySendSchema = object({
  query: object({
    resend: boolean().optional(),
  }),
});
export type ApiGetVerifySendQuery = InferType<typeof ApiGetVerifySendSchema>["query"];

export async function handleGetVerifySend(userId: string, { resend = false }: ApiGetVerifySendQuery = {}) {
  const user = await handleGetUser(userId);
  if (!user) throw new Error("User not found");
  if (user.emailVerified) throw new Error("User already verified");

  const token = await VerificationToken.findOne({ identifier: user.email }).catch(() => null);
  if (token && !resend) throw new Error("Token already sent");

  return await EmailVerifier({
    dbConnect: connectMongoose(),
    models: { User, VerificationToken },
  }).send(user, "verification");
}

handler.get(
  authorization({ isUser: true }),
  validation(ApiGetVerifySendSchema),
  async (req, res) => {
    const { userId } = req.locals.authorized as AuthorizedType;
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetVerifySendSchema>;

    await handleGetVerifySend(userId!, query);

    return res.status(204).end();
  }
);


export default handler;