"use client";

import Link from "next/link";
import { useActionState } from "react";

import { EmailRounded, KeyboardArrowLeftRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";

import loginFormForgotSubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import pages from "@/pages";
import { appendQuery } from "@/utils/url";



export type LoginFormForgotProps = {
  callbackUrl: string,
  defaultEmail: string | undefined,
  plan: string | undefined,
};

export default function LoginFormForgot({
  callbackUrl,
  defaultEmail,
  plan,
}: LoginFormForgotProps) {
  const [lastResult, formAction] = useActionState(
    loginFormForgotSubmit,
    null,
  );


  return (
    <Stack spacing={2}>
      <Button
        startIcon={<KeyboardArrowLeftRounded />}
        component={Link}
        href={appendQuery(pages.login, { email: defaultEmail, callbackUrl, plan })}
        sx={{ alignSelf: "flex-start" }}
      >
        Back
      </Button>

      <div>
        <Typography
          component="h1"
          variant="h3"
        >
          Reset password
        </Typography>
      </div>

      <Typography variant="caption" color="text.secondary">
        We&apos;ll send you an email with instructions to reset your password if we find an account for your email.
      </Typography>

      <form action={formAction}>
        <input
          name="callbackUrl"
          type="hidden"
          defaultValue={callbackUrl}
          readOnly
        />

        <input
          name="plan"
          type="hidden"
          defaultValue={plan}
          readOnly
        />

        <Stack pt={2} spacing={4}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            name="email"
            type="email"
            label="Email"
            autoComplete="username"
            required
            defaultValue={defaultEmail ?? ""}
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
                Reset password
              </LoadingButton>
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}