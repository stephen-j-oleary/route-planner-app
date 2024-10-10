import "client-only";

import React from "react";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Alert, Button, Stack, Typography } from "@mui/material";

import loginFormPasswordSubmit from "./action";
import LoginFormPasswordInput from "../../inputs/Password";
import LoginFormSubmitInput from "../../inputs/Submit";
import FormSubmit from "@/components/ui/FormSubmit";


export type LoginFormProps = {
  callbackUrl?: string,
  email: string,
  action: string,
  onBack: () => void,
};

export default function LoginFormPasswordStep({
  callbackUrl,
  email,
  action,
  onBack,
}: LoginFormProps) {
  const [passwordValue, setPasswordValue] = React.useState("");

  const [lastResult, formAction] = React.useActionState(
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
        onClick={onBack}
      >
        Back
      </Button>

      <div>
        <Typography
          component="p"
          variant="h3"
        >
          {action === "register" ? "Sign up for free" : "Welcome back!"}
        </Typography>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          {action === "register" ? "Creating acount for" : "Logging in as"} {email}
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
            />

            <input
              name="email"
              type="hidden"
              defaultValue={email}
            />

            <LoginFormPasswordInput
              isNew={action === "register"}
              name="password"
              value={passwordValue}
              onChange={v => setPasswordValue(v)}
              required
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
              <LoginFormSubmitInput
                loading={status.pending}
                submitText={
                  action == "register"
                    ? "Sign up"
                    : "Login"
                }
              />
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}