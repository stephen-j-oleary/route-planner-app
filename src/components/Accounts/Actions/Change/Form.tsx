"use client";

import Link from "next/link";
import { FormHTMLAttributes, useActionState, useState } from "react";

import { LoadingButton } from "@mui/lab";
import { Alert, Button, DialogActions, DialogContent, Stack } from "@mui/material";

import changePasswordFormSubmit from "./action";
import FormSubmit from "@/components/ui/FormSubmit";
import PasswordField from "@/components/ui/PasswordField";
import { IAccount } from "@/models/Account";
import pages from "@/pages";
import { FromMongoose } from "@/utils/mongoose";


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
            value={account.id}
          />

          <input
            name="credentials_email"
            type="hidden"
            value={account.credentials_email}
          />

          <PasswordField
            isNew
            name="credentials_password"
            label="New password"
            value={passwordValue}
            onChange={e => setPasswordValue(e.currentTarget.value)}
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