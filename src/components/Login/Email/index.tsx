"use client";

import Link from "next/link";
import { useActionState } from "react";

import { EmailRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField, Typography } from "@mui/material";

import loginFormEmailSubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import pages from "@/pages";
import { appendQuery } from "@/utils/url";


export type LoginFormEmailProps = {
  callbackUrl: string,
  plan: string | undefined,
  defaultEmail?: string,
};


export default function LoginFormEmail({
  callbackUrl,
  plan,
  defaultEmail,
}: LoginFormEmailProps) {
  const [lastResult, formAction] = useActionState(
    loginFormEmailSubmit,
    null,
  );


  return (
    <Stack spacing={2}>
      <div>
        <Typography
          component="h1"
          variant="h3"
        >
          Log in or sign up
        </Typography>
      </div>

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
          <div>
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
              style={{ display: "none" }}
            />

            <Box display="flex" justifyContent="flex-end" pt={1}>
              <Button
                size="small"
                component={Link}
                href={appendQuery(pages.login_forgot, { email: defaultEmail, callbackUrl, plan })}
              >
                Forgot password
              </Button>
            </Box>
          </div>

          {
            !!lastResult?.error && (
              <Alert severity="error">
                {lastResult.error}
              </Alert>
            )
          }

          {/* Handle preloading */}
          <Link href={pages.login_password} style={{ display: "none" }} />

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