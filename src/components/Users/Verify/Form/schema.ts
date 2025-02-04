import { object, string } from "yup";


const VerifyFormSchema = object()
  .shape({
    code: string()
      .typeError("Please enter a valid verification code")
      .required("Please enter a verification code"),
    callbackUrl: string()
      .required("Missing callback url"),
  });


export default VerifyFormSchema;