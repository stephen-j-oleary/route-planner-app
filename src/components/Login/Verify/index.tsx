"use client";

import Link from "next/link";
import { useActionState } from "react";

import { EmailRounded, KeyboardArrowLeftRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";

import loginFormVerifySubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import pages from "@/pages";
import { appendQuery } from "@/utils/url";



export type LoginFormVerifyProps = {
  callbackUrl: string,
  intent: string,
  email: string,
  plan: string | undefined,
};

export default function LoginFormVerify({
  callbackUrl,
  intent,
  email,
  plan,
}: LoginFormVerifyProps) {
  const [lastResult, formAction] = useActionState(
    loginFormVerifySubmit,
    null,
  );


  return (
    <Stack spacing={2}>
      <Button
        startIcon={<KeyboardArrowLeftRounded />}
        component={Link}
        href={appendQuery(pages.login, { email, callbackUrl, plan })}
        sx={{ alignSelf: "flex-start" }}
      >
        Back
      </Button>

      <div>
        <Typography
          component="h1"
          variant="h3"
        >
          Verify email
        </Typography>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          Verification email sent to {email}
        </Typography>
      </div>

      <Typography variant="caption">
        Check your email for a verification code and enter it here. Don&apos;t forget to check your junk folder if you can&apos;t find an email.
      </Typography>

      <form action={formAction}>
        <input
          name="callbackUrl"
          type="hidden"
          defaultValue={callbackUrl}
          readOnly
        />

        <input
          name="intent"
          type="hidden"
          defaultValue={intent}
          readOnly
        />

        <input
          name="plan"
          type="hidden"
          defaultValue={plan}
          readOnly
        />

        <input
          name="email"
          type="hidden"
          defaultValue={email}
          readOnly
        />

        <Stack pt={2} spacing={4}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            name="code"
            label="Verification code"
            required
            defaultValue=""
          />

          {
            !!lastResult?.error && (
              <Alert severity="error">
                {lastResult.error}
              </Alert>
            )
          }

          <FormSubmit
            renderSubmit={status => (
              <LoadingButton
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                loadingPosition="start"
                loading={status.pending}
                startIcon={<EmailRounded />}
              >
                Continue
              </LoadingButton>
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}