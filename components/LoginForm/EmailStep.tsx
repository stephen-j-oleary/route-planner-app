import { yupResolver } from "@hookform/resolvers/yup";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as yup from "yup";

import { Stack, Typography } from "@mui/material";

import LoginFormEmailInput from "@/components/LoginForm/inputs/Email";
import LoginFormSubmitInput from "@/components/LoginForm/inputs/Submit";
import ProvidersList from "@/components/LoginForm/ProvidersList";
import { LoginFormViewProps } from "@/components/LoginForm/View";
import { getAccountsProviders } from "@/shared/services/accounts";
import { getUsers } from "@/shared/services/users";

const Alert = dynamic(() => import("@mui/material/Alert"), { ssr: false });


const emailFormSchema = yup.object({
  email: yup.string()
    .required("Please enter an email")
    .email("Please enter a valid email"),
});

type LoginFormEmailStepFields = yup.InferType<typeof emailFormSchema>;

export type LoginFormEmailStepProps = LoginFormViewProps;

export default function LoginFormEmailStep({
  setData,
  setFormStep,
}: LoginFormEmailStepProps) {
  const { query } = useRouter();
  const {
    callbackUrl = "/account",
  } = query as { callbackUrl?: string };

  const form = useForm<LoginFormEmailStepFields>({
    mode: "onTouched",
    shouldUnregister: true,
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(emailFormSchema)
  });

  type SubmitData = { error?: never } & LoginFormEmailStepFields;
  type SubmitError = { error: Error } & Partial<LoginFormEmailStepFields>;
  const submitMutation = useMutation({
    mutationFn: async ({ error, email }: SubmitData | SubmitError) => {
      if (error) throw error;

      setData(data => ({ ...data, email }));

      const users = await getUsers({ email });
      if (!users?.length) return setFormStep("register");

      const accounts = await getAccountsProviders({ userId: users[0]._id });
      if (!accounts.find(v => v.provider === "credentials")) {
        // No credentials account; Use the provider sign in
        return void await signIn(accounts[0].provider, { callbackUrl });
      }

      return setFormStep("login");
    },
  });


  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
    >
      <Typography
        component="h1"
        variant="h5"
      >
        Log in or sign up
      </Typography>

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
        <ProvidersList
          callbackUrl={callbackUrl}
          actionText="Continue with"
        />

        <Typography
          variant="body1"
          textAlign="center"
        >
          - or -
        </Typography>

        <Stack spacing={2}>
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <LoginFormEmailInput
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
          submitText="Continue with email"
        />
      </Stack>
    </Stack>
  );
}