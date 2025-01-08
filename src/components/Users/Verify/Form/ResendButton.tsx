"use client";

import { useActionState, useTransition } from "react";

import { LoadingButton } from "@mui/lab";
import { ButtonProps } from "@mui/material";

import { resendToken } from "./action";


export default function ResendButton(props: ButtonProps) {
  const [, action] = useActionState(
    resendToken,
    null,
  );
  const [pending, startTransition] = useTransition();

  const handleClick = () => startTransition(
    () => action(),
  );

  return (
    <LoadingButton
      type="button"
      loading={pending}
      onClick={handleClick}
      {...props}
    >
      Resend code
    </LoadingButton>
  );
}