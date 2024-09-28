import { object, string } from "yup";


export const PostUserBodySchema = object()
  .shape({
    email: string()
      .typeError("Invalid email")
      .email("Invalid email")
      .required("Missing email"),
    password: string()
      .typeError("Invalid passsord")
      .required("Missing password"),
  });

export const UserProfileSchema = object()
  .shape({
    id: string()
      .typeError("Invalid id")
      .required("Missing id"),
    name: string()
      .typeError("Invalid name")
      .optional(),
  });