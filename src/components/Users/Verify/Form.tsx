"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { object, string } from "yup";

import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField } from "@mui/material";

import { verifyUser, verifyUserSend } from "@/services/verify";


const VerifyFormSchema = object({
  code: string().required("Please enter a verification code"),
});
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

  const verifyUserMutation = useMutation({
    mutationFn: verifyUser,
  });
  const resendCodeMutation = useMutation({
    mutationFn: verifyUserSend,
  });


  return (
    <Box
      component="form"
      onSubmit={form.handleSubmit(
        data => verifyUserMutation.mutate(
          data,
          { onSuccess: () => void (callbackUrl && router.push(callbackUrl)) }
        )
      )}
    >
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
              error={fieldState.invalid || verifyUserMutation.isError}
              helperText={fieldState.error?.message || (verifyUserMutation.isError && "Invalid or expired code")}
              onChange={e => onChange((e.currentTarget.value || "").toUpperCase())}
              {...field}
            />
          )}
        />

        <LoadingButton
          type="button"
          sx={{ flex: "1 0 auto" }}
          loading={resendCodeMutation.isPending}
          onClick={() => resendCodeMutation.mutate({ resend: true })}
        >
          Resend code
        </LoadingButton>
      </Stack>

      <LoadingButton
        type="submit"
        variant="contained"
        loading={verifyUserMutation.isPending}
      >
        Verify email
      </LoadingButton>
    </Box>
  );
}