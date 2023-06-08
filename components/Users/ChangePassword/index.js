import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import YupPassword from "yup-password";

import { LoadingButton } from "@mui/lab";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Stack } from "@mui/material";

import DialogCloseButton from "@/components/DialogCloseButton";
import SignInFormPasswordInput from "@/components/SignInForm/inputs/PasswordInput";
import useDeferred from "@/shared/hooks/useDeferred";
import { useGetAccounts, useUpdateAccountCredentialsById } from "@/shared/reactQuery/useAccounts";

YupPassword(yup);


const selectCredentialAccount = data => data?.find(item => item.provider === "credentials");

export default function ChangePassword(props) {
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

function ChangePasswordDialog({
  credentialAccount,
  ...props
}) {
  // Destructure onClose here so it's passed to the Dialog component
  const { onClose } = props;

  const defaultValues = useDeferred(
    [!!credentialAccount],
    {
      id: credentialAccount?._id,
      oldCredentials: {
        email: credentialAccount?.credentials.email,
        password: "",
      },
      email: credentialAccount?.credentials.email,
      password: "",
    }
  );

  const form = useForm({
    mode: "all",
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: defaultValues.execute,
  });

  const changePasswordMutation = useUpdateAccountCredentialsById({
    onSuccess: onClose,
  });

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      {...props}
    >
      <form onSubmit={form.handleSubmit(changePasswordMutation.mutate)}>
        <DialogTitle>
          Change password

          <DialogCloseButton onClick={onClose} />
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={2}
            paddingY={1}
          >
            <SignInFormPasswordInput
              form={form}
              name="oldCredentials.password"
              schema={yup.string().required()}
              label="Current Password"
              disabled={form.formState.isLoading}
            />

            <SignInFormPasswordInput
              form={form}
              name="password"
              schema={
                yup
                  .string()
                  .required()
                  .password()
                  .minSymbols(0)
              }
              label="New Password"
              isNew
              disabled={form.formState.isLoading}
            />

            {
              changePasswordMutation.isError && (
                <Alert severity="error">
                  {
                    changePasswordMutation.error?.message
                      || "An error occurred. Please try again"
                  }
                </Alert>
              )
            }
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            loading={changePasswordMutation.isLoading}
            disabled={form.formState.isLoading}
          >
            Change password
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}