import dynamic from "next/dynamic";
import React from "react";
import { Controller } from "react-hook-form";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import LoginFormEmailInput from "./inputs/Email";
import LoginFormPasswordInput from "./inputs/Password";
import LoginFormSubmitInput from "./inputs/Submit";
import useLoginForm, { LoginFormData } from "./useLogic";
import ProvidersList from "../Providers/List";

const Alert = dynamic(() => import("@mui/material/Alert"), { ssr: false });


export type LoginFormViewProps = {
  callbackUrl?: string,
  error?: string,
  defaultValues?: Partial<LoginFormData>,
};

export default function LoginFormView({
  callbackUrl = "/account",
  error,
  defaultValues,
  ...props
}: LoginFormViewProps) {
  const {
    form,
    submitMutation,
    formStep,
    providers,
    handleBackToEmail,
  } = useLoginForm({
    callbackUrl,
    defaultValues,
  });

  const email = form.watch("email");


  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
      {...props}
    >
      {
        formStep !== "email" && (
          <Button
            startIcon={<KeyboardArrowLeftRounded />}
            onClick={handleBackToEmail}
          >
            Back
          </Button>
        )
      }

      <Box>
        <Typography
          component={formStep !== "email" ? "p" : "h1"}
          variant="h5"
        >
          {
            formStep === "register"
              ? "Sign up"
              : formStep === "login"
              ? "Welcome back!"
              : "Log in or sign up"
          }
        </Typography>

        {
          formStep === "login" && (
            <Typography
              component="p"
              variant="body2"
              color="text.secondary"
            >
              Logging in as {email}
            </Typography>
          )
        }
      </Box>

      <Stack
        width="100%"
        pt={1}
        spacing={4}
        component="form"
        onSubmit={form.handleSubmit(
          data => submitMutation.mutate(data)
        )}
      >
        {
          formStep === "email" && (
            <>
              <ProvidersList
                providersQuery={providers}
                callbackUrl={callbackUrl}
                actionText="Continue with"
              />

              <Typography
                variant="body1"
                textAlign="center"
              >
                - or -
              </Typography>
            </>
          )
        }

        <Box>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              formStep === "email"
                ? (
                  <LoginFormEmailInput
                    fieldState={fieldState}
                    {...field}
                  />
                )
                : <input type="hidden" {...field} />
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              formStep !== "email"
                ? (
                  <LoginFormPasswordInput
                    isNew={formStep === "register"}
                    fieldState={fieldState}
                    {...field}
                  />
                )
                : <input type="hidden" {...field} />
            )}
          />
        </Box>

        <Stack spacing={2}>
          {
            !!error && (
              <Alert severity="error">
                {error}
              </Alert>
            )
          }

          {
            submitMutation.error instanceof Error && (
              <Alert severity="error">
                {submitMutation.error?.message || "An error occurred. Please try again"}
              </Alert>
            )
          }
        </Stack>

        <LoginFormSubmitInput
          loading={submitMutation.isLoading}
          submitText={
            formStep == "register"
              ? "Sign up"
              : formStep === "login"
              ? "Login"
              : "Continue with email"
          }
        />
      </Stack>
    </Stack>
  );
}