import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { InferType, object, string } from "yup";

import { KeyboardArrowLeftRounded } from "@mui/icons-material";
import { Button, Stack, Typography } from "@mui/material";

import LoginFormPasswordInput from "@/components/LoginForm/inputs/Password";
import LoginFormSubmitInput from "@/components/LoginForm/inputs/Submit";
import { LoginFormViewProps } from "@/components/LoginForm/View";

const Alert = dynamic(() => import("@mui/material/Alert"), { ssr: false });


const registerFormSchema = object({
  email: string()
    .email("Please enter a valid email")
    .required("Please enter an email"),
  password: string()
    .required("Please enter a password"),
});

type LoginFormRegisterStepFields = InferType<typeof registerFormSchema>;

export type LoginFormRegisterStepProps = LoginFormViewProps;

export default function LoginFormRegisterStep({
  data,
  setFormStep,
  callbackUrl,
}: LoginFormRegisterStepProps) {
  const router = useRouter();

  const form = useForm<LoginFormRegisterStepFields>({
    mode: "all",
    shouldUnregister: true,
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: data,
    resolver: yupResolver(registerFormSchema),
  });

  type SubmitData = { error?: never } & LoginFormRegisterStepFields;
  type SubmitError = { error: Error } & Partial<LoginFormRegisterStepFields>;
  const submitMutation = useMutation({
    mutationFn: async ({ error, email, password }: SubmitData | SubmitError) => {
      if (error) throw error;
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.ok) return router.push(callbackUrl);
      if (res?.error === "CredentialsSignin") throw new Error("Invalid email or password");
      throw new Error("An error occured. Please try again");
    },
  });

  const handleBack = () => setFormStep("email");

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

      <Typography
        component="p"
        variant="h5"
      >
        Sign up
      </Typography>

      <Stack
        width="100%"
        pt={1}
        spacing={4}
        component="form"
        onSubmit={form.handleSubmit(
          data => submitMutation.mutate(data)
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
                isNew
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
          submitText="Sign up"
        />
      </Stack>
    </Stack>
  );
}