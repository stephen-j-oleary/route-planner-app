import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as yup from "yup";
import YupPassword from "yup-password";

import { LoadingButton } from "@mui/lab";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Stack } from "@mui/material";

import DialogCloseButton from "@/components/DialogCloseButton";
import SignInFormPasswordInput from "@/components/SignInForm/inputs/PasswordInput";
import useDeferred from "@/shared/hooks/useDeferred";
import { useDeleteAccountById, useGetAccounts } from "@/shared/reactQuery/useAccounts";
import { useGetProviders } from "@/shared/reactQuery/useProviders";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import providerLogos from "@/shared/utils/auth/providerLogos";

YupPassword(yup);


const selectProviderAccount = data => data?.find(item => item.provider !== "credentials");

export default function UnlinkProvider(props) {
  const providers = useGetProviders();
  const accounts = useGetAccounts();
  const providerAccount = selectProviderAccount(accounts.data);

  const popupState = usePopupState({
    popupId: "formDialog",
    variant: "dialog",
  });


  if (!accounts.isLoading && !providerAccount) return null;
  if (!providers.isLoading && !providers.data) return null;
  if (accounts.isLoading || providers.isLoading) {
    return (
      <Skeleton variant="rounded">
        <Button {...props}>
          Unlink from Provider...
        </Button>
      </Skeleton>
    );
  }

  const providerName = providers.data[providerAccount.provider].name;
  const ProviderLogo = providerLogos[providerAccount.provider];

  return (
    <>
      <Button
        color="inherit"
        startIcon={ProviderLogo && <ProviderLogo />}
        {...bindTrigger(popupState)}
        {...props}
      >
        Unlink from {providerName}...
      </Button>

      <CreatePasswordDialog
        providerAccount={providerAccount}
        {...bindDialog(popupState)}
      />
    </>
  );
}

function CreatePasswordDialog({
  providerAccount,
  ...props
}) {
  // Destructure onClose here so it's passed to the Dialog component
  const { onClose } = props;

  const queryClient = useQueryClient();
  const authUser = useGetSession({ select: selectUser });

  const defaultValues = useDeferred(
    [!!authUser.data],
    {
      email: authUser.data?.email ?? "",
      password: "",
    }
  )

  const form = useForm({
    mode: "all",
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: defaultValues.execute,
  });

  const setPasswordMutation = useMutation({
    mutationFn: async data => {
      const { ok, error } = await signIn("credentials", { ...data, redirect: false });
      if (error === "CredentialsSignin") throw new Error("Invalid password");
      if (!ok) throw new Error("An error occured. Please try again");
    },
    onSuccess() {
      queryClient.invalidateQueries(["accounts"]);
      deleteAccountMutation.mutate(providerAccount._id);
    },
  });
  const deleteAccountMutation = useDeleteAccountById({ onSuccess: onClose });

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      {...props}
    >
      <form onSubmit={form.handleSubmit(setPasswordMutation.mutate)}>
        <DialogTitle>
          Create password
          <DialogCloseButton onClick={onClose} />
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={3}
            paddingY={1}
          >
            <Alert severity="info">
              You must create a password before unlinking the authorization provider
            </Alert>

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
              setPasswordMutation.isError && (
                <Alert severity="error">
                  {
                    setPasswordMutation.error?.message
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
            autoFocus
            onClick={onClose}
          >
            Cancel
          </Button>

          <LoadingButton
            type="submit"
            loading={
              setPasswordMutation.isLoading
                || deleteAccountMutation.isLoading
            }
            disabled={form.formState.isLoading}
          >
            Create password and unlink provider
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}