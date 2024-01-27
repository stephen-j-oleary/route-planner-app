import { InferType, object, string } from "yup";

import Account from "@/models/Account";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { handleGetAccountById } from "@/pages/api/accounts/[id]";
import { ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();


const ApiPatchAccountCredentialsSchema = object({
  query: object({
    id: string().required(),
  }),
  body: object({
    credentials_email: string().required(),
    credentials_password: string().required(),
  }),
});
export type ApiPatchAccountCredentialsQuery = InferType<typeof ApiPatchAccountCredentialsSchema>["query"];
export type ApiPatchAccountCredentialsBody = InferType<typeof ApiPatchAccountCredentialsSchema>["body"];
export type ApiPatchAccountCredentialsResponse = Awaited<ReturnType<typeof handlePatchAccountCredentialsById>>;

export async function handlePatchAccountCredentialsById(id: string, data: Pick<ApiPatchAccountCredentialsBody, "credentials_email" | "credentials_password">) {
  return await Account.findByIdAndUpdate(id, data).lean().exec();
}

handler.patch(
  authorization({ isUser: true }),
  validation(ApiPatchAccountCredentialsSchema),
  async (req, res) => {
    const { query, body } = req.locals.validated as ValidatedType<typeof ApiPatchAccountCredentialsSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Get account
    const account = await handleGetAccountById(id);
    if (!account) throw new NotFoundError();

    // Check owner
    if (!compareMongoIds(userId, account.userId)) throw new ForbiddenError();

    // Update the account
    const updatedAccount = await handlePatchAccountCredentialsById(id, body);
    if (!updatedAccount) throw new NotFoundError();

    res.status(200).json(updatedAccount satisfies NonNullable<ApiPatchAccountCredentialsResponse>);
  }
);

export default handler;