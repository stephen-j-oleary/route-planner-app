import { handleGetUser } from "..";
import User from "@/models/User";
import VerificationToken from "@/models/VerificationToken";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import EmailVerifier from "@/utils/auth/EmailVerifier";
import connectMongoose from "@/utils/connectMongoose";


const handler = nextConnect();


export async function handleGetVerifyUserResend(userId: string) {
  const user = await handleGetUser(userId);
  if (!user) throw new Error("User not found");
  if (user.emailVerified) throw new Error("User already verified");

  return await EmailVerifier({
    dbConnect: connectMongoose(),
    models: {
      User,
      VerificationToken,
    },
  }).send(user, "verification");
}

handler.get(
  authorization({ isUser: true }),
  async (req, res) => {
    const { userId } = req.locals.authorized as AuthorizedType;

    await handleGetVerifyUserResend(userId!);

    return res.status(204).end();
  }
);


export default handler;