import VerificationToken, { IVerificationToken, verificationTokenPublicFields } from "@/models/VerificationToken";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import { handleGetUser } from "@/pages/api/user";
import { NotFoundError } from "@/utils/ApiErrors";


const handler = nextConnect();


export type ApiGetVerifyResponse = Awaited<ReturnType<typeof handleGetVerify>>;

export async function handleGetVerify(userId: string) {
  const user = await handleGetUser(userId);
  if (!user) return null;
  return await VerificationToken.findOne({ identifier: user.email }, verificationTokenPublicFields).lean().exec() as Pick<IVerificationToken, typeof verificationTokenPublicFields[number]>;
}

handler.get(
  authorization({ isUser: true }),
  async (req, res) => {
    const { userId } = req.locals.authorized as AuthorizedType;

    const token = await handleGetVerify(userId!);
    if (!token) throw new NotFoundError();

    return res.status(200).json(token);
  }
)


export default handler;