"use client";

import Link from "next/link";
import { useActionState } from "react";

import { EmailRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Stack, TextField, Typography } from "@mui/material";

import { loginFormEmailSubmit } from "../../actions";
import FormSubmit from "@/components/ui/FormSubmit";
import pages from "pages";


export type LoginFormEmailStepProps = {
  callbackUrl: string,
  defaultEmail?: string,
};


export default function LoginFormEmailStep({
  callbackUrl,
  defaultEmail,
}: LoginFormEmailStepProps) {
  const [lastResult, formAction] = useActionState(
    loginFormEmailSubmit,
    null,
  );


  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
    >
      <div>
        <Typography
          component="h1"
          variant="h3"
        >
          Log in or sign up
        </Typography>
      </div>

      <form
        action={formAction}
        style={{ width: "100%" }}
      >
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
              name="email"
              type="email"
              label="Email"
              autoComplete="username"
              required
              defaultValue={defaultEmail ?? ""}
            />

            <input
              name="password"
              type="password"
              autoComplete="current-password"
              defaultValue=""
              readOnly
              style={{ display: "none" }}
            />
          </div>

          {
            !!lastResult?.error && (
              <Alert severity="error">
                {lastResult.error}
              </Alert>
            )
          }

          {/* Handle preloading */}
          <Link href={pages.login_new} style={{ display: "none" }} />
          <Link href={pages.login_existing} style={{ display: "none" }} />

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
                Continue with email
              </LoadingButton>
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}