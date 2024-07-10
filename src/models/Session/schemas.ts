import { boolean, object, string } from "yup";


export const PostSigninBodySchema = object()
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
      .optional()
      .default(false),
  })
  .required()
  .noUnknown();