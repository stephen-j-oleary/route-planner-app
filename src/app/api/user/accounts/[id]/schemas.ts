import { InferType, object, string } from "yup";

import { deleteUserAccountById, getUserAccountById, patchUserAccountById } from "./actions";


export type ApiGetUserAccountByIdResponse = Awaited<ReturnType<typeof getUserAccountById>>;


export const ApiPatchUserAccountByIdBodySchema = object()
  .shape({
    credentials_email: string().required(),
    credentials_password: string().required(),
  })
  .noUnknown();
export type ApiPatchUserAccountByIdBody = InferType<typeof ApiPatchUserAccountByIdBodySchema>;
export type ApiPatchUserAccountByIdResponse = Awaited<ReturnType<typeof patchUserAccountById>>;


export type ApiDeleteUserAccountByIdResponse = Awaited<ReturnType<typeof deleteUserAccountById>>;