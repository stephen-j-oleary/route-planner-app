"use client";

import { useActionState, useState } from "react";

import { ArrowForwardRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack, TextField, Typography } from "@mui/material";

import verifyUser from "./action";
import ResendButton from "./ResendButton";
import FormSubmit from "@/components/ui/FormSubmit";


export type VerifyFormProps = {
  email: string,
  callbackUrl: string,
};

export default function VerifyForm({
  email,
  callbackUrl,
}: VerifyFormProps) {
  const [codeValue, setCodeValue] = useState("");

  const [lastResult, formAction] = useActionState(
    verifyUser,
    null
  );


  return (
    <Stack spacing={2}>
      <div>
        <Typography
          component="h1"
          variant="h3"
        >
          Verify your email
        </Typography>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          Logged in as {email}
        </Typography>
      </div>

      <Typography variant="caption">
        Check your email for a verification code and enter it here. Don&apos;t forget to check your junk folder if you can&apos;t find an email. <ResendButton size="small" />
      </Typography>

      <form action={formAction}>
        <Stack pt={2} spacing={4}>
          <div>
            <input
              name="callbackUrl"
              type="hidden"
              defaultValue={callbackUrl}
              readOnly
            />

            <TextField
              fullWidth
              variant="outlined"
              size="small"
              name="code"
              label="Verification code"
              required
              value={codeValue}
              onChange={e => setCodeValue((e.currentTarget.value || "").toUpperCase())}
              helperText={lastResult?.error}
              error={!!lastResult?.error}
            />
          </div>

          <FormSubmit
            renderSubmit={status => (
              <LoadingButton
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                loadingPosition="end"
                loading={status.pending}
                endIcon={<ArrowForwardRounded />}
              >
                Verify email
              </LoadingButton>
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}