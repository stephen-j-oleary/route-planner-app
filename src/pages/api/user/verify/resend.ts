import { handleGetUser } from "..";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import EmailVerification from "@/utils/auth/EmailVerification";


const handler = nextConnect();


export async function handleGetVerifyUserResend(userId: string) {
  const user = await handleGetUser(userId);
  if (!user) throw new Error("User not found");
  if (user.emailVerified) throw new Error("User already verified");

  return await EmailVerification.resend(user);
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