import EmailIcon from "@mui/icons-material/EmailRounded";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";


export type LoginFormSubmitInputProps = LoadingButtonProps & {
  submitText?: string,
};

export default function LoginFormSubmitInput({
  submitText = "Submit",
  ...props
}: LoginFormSubmitInputProps) {
  return (
    <LoadingButton
      type="submit"
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