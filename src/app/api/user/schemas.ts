import { InferType, object, string } from "yup";

import { getUserById, patchUser } from "./actions";


export type ApiGetUserResponse = Awaited<ReturnType<typeof getUserById>>;


export const ApiPatchUserBodySchema = object()
  .shape({
    name: string().optional(),
    image: string().optional(),
  })
  .required()
  .noUnknown();

export type ApiPatchUserBody = InferType<typeof ApiPatchUserBodySchema>;
export type ApiPatchUserResponse = Awaited<ReturnType<typeof patchUser>>;