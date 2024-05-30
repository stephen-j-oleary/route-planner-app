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