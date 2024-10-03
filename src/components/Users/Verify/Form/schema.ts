import { object, string } from "yup";


const VerifyFormSchema = object({
  code: string().required("Please enter a verification code"),
});


export default VerifyFormSchema;