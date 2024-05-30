import { Alert, AlertTitle } from "@mui/material";

import VerifyForm from "@/components/Users/Verify/Form";


export type UserVerifyAlertProps = {
  callbackUrl?: string,
};

export default function UserVerifyAlert({
  callbackUrl,
}: UserVerifyAlertProps) {
  return (
    <Alert
      severity="warning"
      sx={{
        "& div:nth-of-type(2)": { flex: 1 },
        mb: 2,
      }}
    >
      <AlertTitle>Verify email</AlertTitle>

      Check your email for a verification code and enter it here. Don&apos;t forget to check your junk folder if you can&apos;t find an email

      <VerifyForm callbackUrl={callbackUrl} />
    </Alert>
  );
}