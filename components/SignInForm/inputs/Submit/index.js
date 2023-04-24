import EmailIcon from "@mui/icons-material/EmailRounded";
import { LoadingButton } from "@mui/lab";


export default function SignInFormSubmit({
  submitText = "Submit",
  ...props
}) {
  return (
    <LoadingButton
      loadingPosition="start"
      startIcon={<EmailIcon />}
      variant="contained"
      size="large"
      fullWidth
      {...props}
    >
      {submitText}
    </LoadingButton>
  );
}