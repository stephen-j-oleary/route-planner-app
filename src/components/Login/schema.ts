import { object, string } from "yup";


const LoginFormSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: string()
    .required("Please enter a password")
    .when("$step", { is: "password", otherwise: schema => schema.notRequired().optional() }),
  callbackUrl: string()
    .required("Missing callback url"),
  plan: string()
    .optional(),
});


export default LoginFormSchema;