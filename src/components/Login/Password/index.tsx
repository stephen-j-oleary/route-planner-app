"use client";

import Link from "next/link";
import { useActionState } from "react";

import { EmailRounded, KeyboardArrowLeftRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";

import loginFormPasswordSubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import PasswordField from "@/components/ui/PasswordField";
import pages from "@/pages";
import { appendQuery } from "@/utils/url";


export type LoginFormPasswordProps = {
  isNew: boolean,
  email: string,
  callbackUrl: string,
  plan: string | undefined,
};

export default function LoginFormPassword({
  isNew,
  email,
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
        href={appendQuery(pages.login, { email, callbackUrl, plan })}
        sx={{ alignSelf: "flex-start" }}
      >
        Back
      </Button>

      <div>
        <Typography
          component="p"
          variant="h3"
        >
          {isNew ? "Sign up for free" : "Welcome back!"}
        </Typography>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          {isNew ? "Creating account for" : "Logging in as"} {email}
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
            <input
              name="email"
              type="email"
              autoComplete="username"
              defaultValue={email}
              readOnly
              style={{ display: "none" }}
            />

            <PasswordField
              fullWidth
              variant="outlined"
              size="small"
              isNew={isNew}
              name="password"
              label={isNew ? "Create a Password" : "Password"}
              required
              defaultValue=""
            />

            {
              !isNew && (
                <Box display="flex" justifyContent="flex-end" pt={1}>
                  <Button
                    size="small"
                    component={Link}
                    href={appendQuery(pages.login_forgot, { email, callbackUrl, plan })}
                  >
                    Forgot password
                  </Button>
                </Box>
              )
            }
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
                  isNew ? "Sign up" : "Login"
                }
              </LoadingButton>
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}