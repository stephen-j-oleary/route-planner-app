import { InferType, object, string } from "yup";


const ChangePasswordSchema = object().shape({
  id: string().required(),
  credentials_email: string()
    .email()
    .required(),
  credentials_password: string()
    .required("Please enter a password"),
});

export type ChangePasswordFields = InferType<typeof ChangePasswordSchema>;


export default ChangePasswordSchema;