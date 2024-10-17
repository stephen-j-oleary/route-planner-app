"use client";

import React from "react";

import { LoadingButton } from "@mui/lab";
import { Stack, TextField } from "@mui/material";

import verifyUser from "./action";
import ResendButton from "./ResendButton";
import FormSubmit from "@/components/ui/FormSubmit";
import pages from "pages";


export type VerifyFormProps = {
  callbackUrl?: string,
};

export default function VerifyForm({
  callbackUrl = pages.account.root,
}: VerifyFormProps) {
  const [codeValue, setCodeValue] = React.useState("");

  const [, formAction] = React.useActionState(
    verifyUser,
    null
  );


  return (
    <form action={formAction}>
      <input
        name="callbackUrl"
        type="hidden"
        value={callbackUrl}
      />

      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={1}
        py={2}
      >
        <TextField
          name="code"
          label="Verification code"
          value={codeValue}
          onChange={e => setCodeValue((e.currentTarget.value || "").toUpperCase())}
          required
        />

        <ResendButton />
      </Stack>

      <FormSubmit
        renderSubmit={status => (
          <LoadingButton
            type="submit"
            variant="contained"
            loading={status.pending}
          >
            Verify email
          </LoadingButton>
        )}
      />
    </form>
  );
}