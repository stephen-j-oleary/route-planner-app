import { InferType, object } from "yup";
import { string } from "yup";

import User from "@/models/User";
import nextConnect from "@/nextConnect";
import authorization, { AuthorizedType } from "@/nextConnect/middleware/authorization";
import validation, { ValidatedType } from "@/nextConnect/middleware/validation";
import { ForbiddenError, NotFoundError } from "@/utils/ApiErrors";
import compareMongoIds from "@/utils/compareMongoIds";


const handler = nextConnect();


const ApiGetUserSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiGetUserQuery = InferType<typeof ApiGetUserSchema>["query"];
export type ApiGetUserResponse = Awaited<ReturnType<typeof handleGetUserById>>;

export async function handleGetUserById(id: string) {
  return await User.findById(id).lean().exec();
}

handler.get(
  authorization({ isUser: true }),
  validation(ApiGetUserSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiGetUserSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    // Check authorization
    if (!compareMongoIds(userId, id)) throw new ForbiddenError();

    // Get the user
    const user = await handleGetUserById(id);
    if (!user) throw new NotFoundError();

    res.status(200).json(user satisfies NonNullable<ApiGetUserResponse>);
  }
);


const ApiPatchUserSchema = object({
  query: object({
    id: string().required(),
  }),
  body: object({
    name: string().optional(),
    image: string().optional(),
  }),
});
export type ApiPatchUserQuery = InferType<typeof ApiPatchUserSchema>["query"];
export type ApiPatchUserBody = InferType<typeof ApiPatchUserSchema>["body"];
export type ApiPatchUserResponse = Awaited<ReturnType<typeof handlePatchUser>>;

export async function handlePatchUser(id: string, data: ApiPatchUserBody) {
  return await User.findByIdAndUpdate(id, data).lean().exec();
}

handler.patch(
  authorization({ isUser: true }),
  validation(ApiPatchUserSchema),
  async (req, res) => {
    const { query, body } = req.locals.validated as ValidatedType<typeof ApiPatchUserSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    if (!compareMongoIds(userId, id)) throw new ForbiddenError();

    const updatedUser = await handlePatchUser(id, body);
    if (!updatedUser) throw new NotFoundError();

    res.status(200).json(updatedUser satisfies NonNullable<ApiPatchUserResponse>);
  }
);


const ApiDeleteUserSchema = object({
  query: object({
    id: string().required(),
  }),
});
export type ApiDeleteUserQuery = InferType<typeof ApiDeleteUserSchema>["query"];

export async function handleDeleteUser(id: string) {
  return await User.findByIdAndDelete(id).lean().exec();
}

handler.delete(
  authorization({ isUser: true }),
  validation(ApiDeleteUserSchema),
  async (req, res) => {
    const { query } = req.locals.validated as ValidatedType<typeof ApiDeleteUserSchema>;
    const { userId } = req.locals.authorized as AuthorizedType;
    const { id } = query;

    if (!compareMongoIds(userId, id)) throw new ForbiddenError();

    await handleDeleteUser(id);

    res.status(204).end();
  }
);

export default handler;