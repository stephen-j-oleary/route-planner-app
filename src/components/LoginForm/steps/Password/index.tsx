"use client";

import Link from "next/link";
import { useActionState } from "react";

import { EmailRounded, KeyboardArrowLeftRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Stack, Typography } from "@mui/material";

import { loginFormPasswordSubmit } from "../../actions";
import FormSubmit from "@/components/ui/FormSubmit";
import PasswordField from "@/components/ui/PasswordField";
import { appendQuery } from "@/utils/url";
import pages from "pages";


export type LoginFormProps = {
  step: string,
  callbackUrl?: string,
  defaultEmail: string,
};

export default function LoginFormPasswordStep({
  step,
  callbackUrl,
  defaultEmail,
}: LoginFormProps) {
  const [lastResult, formAction] = useActionState(
    loginFormPasswordSubmit,
    null,
  );


  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
    >
      <Button
        startIcon={<KeyboardArrowLeftRounded />}
        component={Link}
        href={appendQuery(pages.login, { email: defaultEmail, callbackUrl })}
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