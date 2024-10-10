import { object, string } from "yup";


const LoginFormEmailSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
});


export default LoginFormEmailSchema;