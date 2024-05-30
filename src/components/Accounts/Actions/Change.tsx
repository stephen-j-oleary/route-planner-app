import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { InferType, object, string } from "yup"

import { LoadingButton } from "@mui/lab";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";

import { ApiPatchUserAccountByIdBody } from "@/app/api/user/accounts/[id]/route";
import LoginFormPasswordInput from "@/components/LoginForm/inputs/Password";
import DialogCloseButton from "@/components/ui/DialogCloseButton";
import { IAccount } from "@/models/Account";
import { updateUserAccountById } from "@/services/accounts";


const changePasswordSchema = object({
  id: string().required(),
  credentials_email: string().email().required(),
  credentials_password: string()
    .required("Please enter a password"),
});

type ChangePasswordFields = InferType<typeof changePasswordSchema>;


export type ChangePasswordProps = {
  account: IAccount,
  renderTrigger: (props: ReturnType<typeof bindTrigger>) => React.ReactNode,
};

export default function ChangePassword({
  account,
  renderTrigger,
}: ChangePasswordProps) {
  const popupState = usePopupState({
    popupId: "change-password",
    variant: "dialog",
  });

  return (
    <>
      {renderTrigger(bindTrigger(popupState))}

      <Dialog
        fullWidth
        maxWidth="xs"
        {...bindDialog(popupState)}
      >
        <ChangePasswordForm
          account={account}
          onClose={() => popupState.close()}
        />
      </Dialog>
    </>
  );
}

type ChangePasswordFormProps = React.FormHTMLAttributes<HTMLFormElement> & {
  account: IAccount,
  onClose: () => void,
};

function ChangePasswordForm({
  account,
  onClose,
  ...props
}: ChangePasswordFormProps) {
  const form = useForm<ChangePasswordFields>({
    mode: "all",
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: {
      id: account._id.toString(),
      credentials_email: account.credentials_email,
      credentials_password: "",
    },
    resolver: yupResolver(changePasswordSchema),
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ id, ...changes }: { id: string } & ApiPatchUserAccountByIdBody) => updateUserAccountById(id, changes),
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
          loading={changePasswordMutation.isPending}
        >
          Change password
        </LoadingButton>
      </DialogActions>
    </form>
  );
}