import { object, string } from "yup";


const LoginFormSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: string()
    .required("Please enter a password")
    .when("$step", { is: "email", then: schema => schema.notRequired().optional() }),
  callbackUrl: string()
    .required("Missing callback url"),
});


export default LoginFormSchema;