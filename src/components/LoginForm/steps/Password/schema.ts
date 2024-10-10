import { object, string } from "yup";


const LoginFormPasswordSchema = object().shape({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: string()
    .required("Please enter a password"),
});


export default LoginFormPasswordSchema;