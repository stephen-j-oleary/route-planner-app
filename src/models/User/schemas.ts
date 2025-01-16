import { boolean, InferType, object, string } from "yup";


export const PostUserBodySchema = object()
  .shape({
    email: string()
      .typeError("Invalid email")
      .email("Invalid email")
      .required("Missing email"),
    password: string()
      .typeError("Invalid password")
      .required("Missing password"),
    link: boolean()
      .typeError("Invalid link")
      .optional(),
  });

export type TPostUserBody = InferType<typeof PostUserBodySchema>;


export const UserProfileSchema = object()
  .shape({
    id: string()
      .typeError("Invalid id")
      .required("Missing id"),
    name: string()
      .typeError("Invalid name")
      .optional(),
    countryCode: string()
      .typeError("Invalid country code")
      .optional(),
  });