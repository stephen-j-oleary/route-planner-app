import { InferType, object } from "yup";
import { string } from "yup";

import User from "@/models/User";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { NotFoundError } from "@/utils/ApiErrors";


const handler = nextConnect();


export type ApiGetUserResponse = Awaited<ReturnType<typeof handleGetUser>>;

export async function handleGetUser(id: string) {
  return await User.findById(id).lean().exec();
}

handler.get(
  authorization({ isUser: true }),
  async (req, res) => {
    const { userId } = req.locals.authorized as AuthorizedType;

    const user = await handleGetUser(userId!);
    if (!user) throw new NotFoundError();

    res.status(200).json(user satisfies NonNullable<ApiGetUserResponse>);
  }
);


const ApiPatchUserSchema = object({
  body: object({
    name: string().optional(),
    image: string().optional(),
  }),
});
export type ApiPatchUserBody = InferType<typeof ApiPatchUserSchema>["body"];
export type ApiPatchUserResponse = Awaited<ReturnType<typeof handlePatchUser>>;

export async function handlePatchUser(id: string, data: ApiPatchUserBody) {
  return await User.findByIdAndUpdate(id, data).lean().exec();
}

handler.patch(
  authorization({ isUser: true }),
  validation(ApiPatchUserSchema),
  async (req, res) => {
    const { body } = req.locals.validated as ValidatedType<typeof ApiPatchUserSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;

    const updatedUser = await handlePatchUser(userId!, body);
    if (!updatedUser) throw new NotFoundError();

    res.status(200).json(updatedUser satisfies NonNullable<ApiPatchUserResponse>);
  }
);


export async function handleDeleteUser(id: string) {
  return await User.findByIdAndDelete(id).lean().exec();
}

handler.delete(
  authorization({ isUser: true }),
  async (req, res) => {
    const { userId } = req.locals.authorized as AuthorizedType;

    await handleDeleteUser(userId!);

    res.status(204).end();
  }
);


export default handler;