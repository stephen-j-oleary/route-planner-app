"use client";

import Link from "next/link";
import { FormHTMLAttributes, useActionState, useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Button, DialogActions, DialogContent, Stack } from "@mui/material";

import changePasswordFormSubmit from "./action";
import LoginFormPasswordInput from "@/components/LoginForm/inputs/Password";
import FormSubmit from "@/components/ui/FormSubmit";
import { IAccount } from "@/models/Account";
import { FromMongoose } from "@/utils/mongoose";
import pages from "pages";


export type ChangePasswordFormProps =
  & FormHTMLAttributes<HTMLFormElement>
  & {
    account: FromMongoose<IAccount>,
  };

export default function ChangePasswordForm({
  account,
  ...props
}: ChangePasswordFormProps) {
  const [passwordValue, setPasswordValue] = useState("");

  const [lastResult, formAction] = useActionState(
    changePasswordFormSubmit,
    null,
  );


  return (
    <form
      action={formAction}
      {...props}
    >
      <DialogContent>
        <Stack
          spacing={2}
          paddingY={1}
        >
          <input
            name="id"
            type="hidden"
            defaultValue={account.id}
          />

          <input
            name="credentials_email"
            type="hidden"
            defaultValue={account.credentials_email}
          />

          <LoginFormPasswordInput
            isNew
            name="credentials_password"
            label="New password"
            value={passwordValue}
            onChange={v => setPasswordValue(v)}
            required
          />

          {
            lastResult?.error && (
              <Alert severity="error">
                {lastResult.error}
              </Alert>
            )
          }
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          component={Link}
          href={pages.account.root}
          replace
        >
          Cancel
        </Button>

        <FormSubmit
          renderSubmit={status => (
            <LoadingButton
              type="submit"
              loading={status.pending}
            >
              Change password
            </LoadingButton>
          )}
        />
      </DialogActions>
    </form>
  );
}