"use client";

import Link from "next/link";
import { useActionState } from "react";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Alert, Button, Stack, Typography } from "@mui/material";

import loginFormChangeSubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import PasswordField from "@/components/ui/PasswordField";


export type LoginFormChangeProps = {
  userEmail: string,
  callbackUrl: string,
  plan: string | undefined,
};

export default function LoginFormChange({
  userEmail,
  callbackUrl,
  plan,
}: LoginFormChangeProps) {
  const [lastResult, formAction] = useActionState(
    loginFormChangeSubmit,
    null,
  );


  return (
    <Stack spacing={2}>
      <Button
        startIcon={<KeyboardArrowLeftRounded />}
        component={Link}
        href={callbackUrl}
        sx={{ alignSelf: "flex-start" }}
      >
        Back
      </Button>

      <div>
        <Typography
          component="p"
          variant="h3"
        >
          Change password
        </Typography>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          Logged in as {userEmail}
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
              defaultValue={userEmail}
              readOnly
              style={{ display: "none" }}
            />

            <PasswordField
              fullWidth
              variant="outlined"
              size="small"
              isNew
              name="password"
              label="Create a new password"
              required
              defaultValue=""
            />
          </div>

          {
            lastResult?.error && (
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
                loading={status.pending}
              >
                Change password
              </LoadingButton>
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}