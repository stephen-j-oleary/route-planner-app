"use client";

import Link from "next/link";
import { useActionState } from "react";

import { EmailRounded, KeyboardArrowLeftRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Stack, Typography } from "@mui/material";

import { loginFormPasswordSubmit } from "./actions";
import FormSubmit from "@/components/ui/FormSubmit";
import PasswordField from "@/components/ui/PasswordField";
import pages from "@/pages";
import { appendQuery } from "@/utils/url";


export type LoginFormPasswordProps = {
  step: string,
  defaultEmail: string,
  callbackUrl: string,
  plan: string | undefined,
};

export default function LoginFormPassword({
  step,
  defaultEmail,
  callbackUrl,
  plan,
}: LoginFormPasswordProps) {
  const [lastResult, formAction] = useActionState(
    loginFormPasswordSubmit,
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
          component="p"
          variant="h3"
        >
          {step === "new" ? "Sign up for free" : "Welcome back!"}
        </Typography>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          {step === "new" ? "Creating acount for" : "Logging in as"} {defaultEmail}
        </Typography>
      </div>

      <form action={formAction}>
        <Stack pt={2} spacing={4}>
          <div>
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

            <input
              name="email"
              type="email"
              autoComplete="username"
              defaultValue={defaultEmail}
              readOnly
              style={{ display: "none" }}
            />

            <PasswordField
              fullWidth
              variant="outlined"
              size="small"
              isNew={step === "new"}
              name="password"
              label={step === "new" ? "Create a Password" : "Password"}
              required
              defaultValue=""
            />
          </div>

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
                {
                  step === "new"
                    ? "Sign up"
                    : "Login"
                }
              </LoadingButton>
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}