import React from "react";

import { LoadingButton } from "@mui/lab";

import { getVerifySend } from "@/app/api/user/verify/send/actions";


export default function ResendButton() {
  const [, action] = React.useActionState(
    () => getVerifySend({ resend: true }),
    null,
  );
  const [pending, startTransition] = React.useTransition();

  const handleClick = () => startTransition(
    () => action(),
  );

  return (
    <LoadingButton
      type="button"
      sx={{ flex: "1 0 auto" }}
      loading={pending}
      onClick={handleClick}
    >
      Resend code
    </LoadingButton>
  );
}