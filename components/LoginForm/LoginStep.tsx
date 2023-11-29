import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

import LoginFormPasswordInput from "@/components/LoginForm/inputs/Password";
import LoginFormSubmitInput from "@/components/LoginForm/inputs/Submit";
import { LoginFormViewProps } from "@/components/LoginForm/View";

const Alert = dynamic(() => import("@mui/material/Alert"), { ssr: false });


const loginFormSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: yup
    .string()
    .required("Please enter a password"),
});

type LoginFormLoginStepFields = yup.InferType<typeof loginFormSchema>;

export type LoginFormLoginStepProps = LoginFormViewProps;

export default function LoginFormLoginStep({
  data,
  setFormStep,
}: LoginFormLoginStepProps) {
  const { query, push } = useRouter();
  const {
    callbackUrl = "/account",
  } = query as { callbackUrl?: string };

  const form = useForm<LoginFormLoginStepFields>({
    mode: "all",
    shouldUnregister: true,
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: data,
    resolver: yupResolver(loginFormSchema)
  });

  const handleBack = () => setFormStep("email");

  type SubmitData = { error?: never } & LoginFormLoginStepFields;
  type SubmitError = { error: Error } & Partial<LoginFormLoginStepFields>;
  const submitMutation = useMutation({
    mutationFn: async ({ error, email, password }: SubmitData | SubmitError) => {
      if (error) throw error;
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res.ok) return push(callbackUrl);
      if (res.error === "CredentialsSignin") throw new Error("Incorrect email or password");
      throw new Error("An error occured. Please try again");
    },
  });

  React.useEffect(
    () => void form.register("email"),
    [form]
  );


  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
    >
      <Button
        startIcon={<KeyboardArrowLeftRounded />}
        onClick={handleBack}
      >
        Back
      </Button>

      <Box>
        <Typography
          component="p"
          variant="h5"
        >
          Welcome back!
        </Typography>

        <Typography
          component="p"
          variant="body2"
          color="text.secondary"
        >
          Logging in as {data.email}
        </Typography>
      </Box>

      <Stack
        width="100%"
        pt={1}
        spacing={4}
        component="form"
        onSubmit={form.handleSubmit(
          data => submitMutation.mutate(data),
          errors => submitMutation.mutate({ error: new Error(JSON.stringify(errors)) })
        )}
      >
        <Stack spacing={2}>
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <LoginFormPasswordInput
                fieldState={fieldState}
                {...field}
              />
            )}
          />
        </Stack>

        {
          submitMutation.error instanceof Error && (
            <Alert severity="error">
              {submitMutation.error?.message || "An error occurred. Please try again"}
            </Alert>
          )
        }

        <LoginFormSubmitInput
          loading={submitMutation.isLoading}
          submitText="Login"
        />
      </Stack>
    </Stack>
  );
}