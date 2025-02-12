import { string } from "yup";

import LoginFormSchema from "../schema";


const LoginFormVerifySchema = LoginFormSchema
  .shape({
    code: string()
      .typeError("Please enter a valid verification code")
      .required("Please enter a verification code"),
    intent: string()
      .typeError("Invalid intent")
      .optional(),
  });


export default LoginFormVerifySchema;