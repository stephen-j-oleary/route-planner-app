import { yupResolver } from "@hookform/resolvers/yup";
import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import mongoose from "mongoose";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { object, string } from "yup"

import { LoadingButton } from "@mui/lab";
import { Alert, Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Stack } from "@mui/material";

import LoginFormPasswordInput from "@/components/LoginForm/inputs/Password";
import DialogCloseButton from "@/components/ui/DialogCloseButton";
import { IAccount } from "@/models/Account";
import { selectCredentialAccount, useGetUserAccounts, useUpdateUserAccountById } from "@/reactQuery/useAccounts";


const changePasswordSchema = object({
  id: string().required(),
  credentials_email: string().email().required(),
  credentials_password: string()
    .required("Please enter a password"),
});

type ChangePasswordFields = yup.InferType<typeof changePasswordSchema>;


export type ChangePasswordProps = ButtonProps;

export default function ChangePassword(props: ChangePasswordProps) {
  const credentialAccount = useGetUserAccounts({ select: selectCredentialAccount });

  const popupState = usePopupState({
    popupId: "formDialog",
    variant: "dialog",
  });

  if (credentialAccount.isLoading) return (
    <Skeleton variant="rounded">
      <Button {...props}>
        Change password...
      </Button>
    </Skeleton>
  );
  if (!credentialAccount.data) return null;


  return (
    <>
      <Button
        {...bindTrigger(popupState)}
        {...props}
      >
        Change password...
      </Button>

      <Dialog
        fullWidth
        maxWidth="xs"
        {...bindDialog(popupState)}
      >
        <ChangePasswordForm
          credentialAccount={credentialAccount.data}
          onClose={() => popupState.close()}
        />
      </Dialog>

    </>
  );
}

type ChangePasswordFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  credentialAccount: mongoose.FlattenMaps<IAccount>,
  onClose: () => void,
};

function ChangePasswordForm({
  credentialAccount,
  onClose,
  ...props
}: ChangePasswordFormProps) {
  const form = useForm<ChangePasswordFields>({
    mode: "all",
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: {
      id: credentialAccount._id.toString(),
      credentials_email: credentialAccount.credentials_email,
      credentials_password: "",
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const changePasswordMutation = useUpdateUserAccountById({
    onSuccess: () => onClose(),
  });

  React.useEffect(
    () => {
      form.register("id");
      form.register("credentials_email");
    },
    [form]
  );


  return (
    <form
      onSubmit={form.handleSubmit(data => changePasswordMutation.mutate(data))}
      {...props}
    >
      <DialogTitle>
        Change password

        <DialogCloseButton onClick={() => onClose()} />
      </DialogTitle>

      <DialogContent>
        <Stack
          spacing={2}
          paddingY={1}
        >
          <Controller
            control={form.control}
            name="credentials_password"
            render={({ field, fieldState }) => (
              <LoginFormPasswordInput
                isNew
                label="New password"
                fieldState={fieldState}
                {...field}
              />
            )}
          />

          {
            changePasswordMutation.error instanceof Error && (
              <Alert severity="error">
                {changePasswordMutation.error.message || "An error occurred. Please try again"}
              </Alert>
            )
          }
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          onClick={() => onClose()}
        >
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          loading={changePasswordMutation.isLoading}
        >
          Change password
        </LoadingButton>
      </DialogActions>
    </form>
  );
}