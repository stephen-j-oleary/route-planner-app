import { yupResolver } from "@hookform/resolvers/yup";
import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import mongoose from "mongoose";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import YupPassword from "yup-password";

import { LoadingButton } from "@mui/lab";
import { Alert, Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Skeleton, Stack } from "@mui/material";

import DialogCloseButton from "@/components/DialogCloseButton";
import LoginFormPasswordInput from "@/components/LoginForm/inputs/Password";
import { IAccount } from "@/shared/models/Account";
import { selectCredentialAccount, useGetAccounts, useUpdateAccountCredentialsById } from "@/shared/reactQuery/useAccounts";

YupPassword(yup);


const changePasswordSchema = yup.object({
  id: yup.string(),
  oldCredentials: yup.object({
    email: yup.string(),
    password: yup.string().required("Please enter a password"),
  }),
  email: yup.string(),
  password: yup
    .string()
    .required()
    .password()
    .minSymbols(0),
});

type ChangePasswordFields = yup.InferType<typeof changePasswordSchema>;


export type ChangePasswordProps = ButtonProps;

export default function ChangePassword(props: ChangePasswordProps) {
  const credentialAccount = useGetAccounts({ select: selectCredentialAccount });

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

      <ChangePasswordDialog
        credentialAccount={credentialAccount.data}
        {...bindDialog(popupState)}
      />
    </>
  );
}

type ChangePasswordDialogProps = DialogProps & {
  credentialAccount: mongoose.FlattenMaps<IAccount>,
};

function ChangePasswordDialog({
  credentialAccount,
  ...props
}: ChangePasswordDialogProps) {
  // Destructure onClose here so it's passed to the Dialog component
  const { onClose } = props;

  const form = useForm<ChangePasswordFields>({
    mode: "all",
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: {
      id: credentialAccount._id.toString(),
      oldCredentials: {
        email: credentialAccount.credentials_email,
        password: "",
      },
      email: credentialAccount.credentials_email,
      password: "",
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const changePasswordMutation = useUpdateAccountCredentialsById({
    onSuccess: () => onClose({}, "backdropClick"),
  });

  React.useEffect(
    () => {
      form.register("id");
      form.register("oldCredentials.email");
      form.register("email");
    },
    [form]
  );


  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      {...props}
    >
      <form onSubmit={form.handleSubmit(data => changePasswordMutation.mutate(data))}>
        <DialogTitle>
          Change password

          <DialogCloseButton onClick={e => onClose(e, "backdropClick")} />
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            paddingY={1}
          >
            <Controller
              control={form.control}
              name="oldCredentials.password"
              render={({ field, fieldState }) => (
                <LoginFormPasswordInput
                  label="Current Password"
                  fieldState={fieldState}
                  {...field}
                />
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <LoginFormPasswordInput
                  isNew
                  label="New Password"
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
            onClick={e => onClose(e, "backdropClick")}
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
    </Dialog>
  );
}