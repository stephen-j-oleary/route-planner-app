import "client-only";

import React from "react";

import { Alert, Stack, Typography } from "@mui/material";

import loginFormEmailSubmit from "./action";
import LoginFormEmailInput from "../../inputs/Email";
import LoginFormSubmitInput from "../../inputs/Submit";
import FormSubmit from "@/components/ui/FormSubmit";


export type LoginFormEmailStepProps = {
  setEmail: (value: string) => void,
  setNextStep: (step: string) => void,
};


export default function LoginFormEmailStep({
  setEmail,
  setNextStep,
}: LoginFormEmailStepProps) {
  const [emailValue, setEmailValue] = React.useState("");

  const [lastResult, formAction] = React.useActionState(
    loginFormEmailSubmit,
    null,
  );

  React.useEffect(
    () => {
      if (lastResult?.nextStep) {
        setEmail(emailValue);
        setNextStep(lastResult.nextStep);
      }
    },
    [lastResult, emailValue, setNextStep, setEmail]
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
            <LoginFormEmailInput
              name="email"
              type="email"
              value={emailValue}
              onChange={v => setEmailValue(v)}
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
                submitText="Continue with email"
              />
            )}
          />
        </Stack>
      </form>
    </Stack>
  );
}