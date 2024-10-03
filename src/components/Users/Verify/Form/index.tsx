"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { LoadingButton } from "@mui/lab";
import { Stack, TextField } from "@mui/material";

import verifyUser from "./action";
import ResendButton from "./ResendButton";
import VerifyFormSchema from "./schema";
import FormSubmit from "@/components/ui/FormSubmit";


export type VerifyFormProps = {
  callbackUrl?: string,
};

export default function VerifyForm({
  callbackUrl,
}: VerifyFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: { code: "" },
    resolver: yupResolver(VerifyFormSchema),
  });

  const [formResult, formAction] = React.useActionState(
    verifyUser,
    null
  );

  React.useEffect(
    () => {
      if (formResult?.success && callbackUrl) router.push(callbackUrl);
    },
    [formResult, callbackUrl, router]
  );


  return (
    <form action={formAction}>
      <Stack
        direction="row"
        alignItems="flex-start"
        spacing={1}
        py={2}
      >
        <Controller
          control={form.control}
          name="code"
          render={({ field: { onChange, ...field }, fieldState }) => (
            <TextField
              label="Verification code"
              error={fieldState.invalid || !!formResult?.error}
              helperText={fieldState.error?.message || (formResult?.error && "Invalid or expired code")}
              onChange={e => onChange((e.currentTarget.value || "").toUpperCase())}
              {...field}
            />
          )}
        />

        <ResendButton />
      </Stack>

      <FormSubmit
        renderSubmit={status => (
          <LoadingButton
            type="submit"
            variant="contained"
            loading={status.pending}
          >
            Verify email
          </LoadingButton>
        )}
      />
    </form>
  );
}