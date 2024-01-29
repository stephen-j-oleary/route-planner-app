import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import mongoose from "mongoose";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as yup from "yup";
import YupPassword from "yup-password";

import { LoadingButton } from "@mui/lab";
import { Alert, Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Skeleton, Stack } from "@mui/material";

import LoginFormPasswordInput from "@/components/LoginForm/inputs/Password";
import DialogCloseButton from "@/components/ui/DialogCloseButton";
import useDeferred from "@/hooks/useDeferred";
import { useDeleteUserAccountById, useGetUserAccounts } from "@/reactQuery/useAccounts";
import { useGetProviders } from "@/reactQuery/useProviders";
import { selectUser, useGetSession } from "@/reactQuery/useSession";
import providerLogos from "@/utils/auth/providerLogos";

YupPassword(yup);


const selectProviderAccount = <TData extends { provider: string },>(data: TData[]) => data?.find(item => item.provider !== "credentials");

export type UnlinkProviderProps = Omit<ButtonProps, "onClick" | "onTouchStart">;

export default function UnlinkProvider(props: UnlinkProviderProps) {
  const providers = useGetProviders();
  const accounts = useGetUserAccounts();
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

  const providerName = providers.data[providerAccount.provider]?.name;
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


export type CreatePasswordDialogProps = DialogProps & {
  providerAccount?: { _id: mongoose.Types.ObjectId },
};

function CreatePasswordDialog({
  providerAccount,
  ...props
}: CreatePasswordDialogProps) {
  // Destructure onClose here so it's passed to the Dialog component
  const { onClose } = props;

  const queryClient = useQueryClient();
  const authUser = useGetSession({ select: selectUser });

  const defaultValues = useDeferred(
    {
      email: authUser.data?.email ?? "",
      password: "",
    },
    !!authUser.data
  )

  const form = useForm({
    mode: "all",
    shouldFocusError: false,
    criteriaMode: "all",
    defaultValues: defaultValues.execute,
  });

  const deleteAccountMutation = useDeleteUserAccountById({ onSuccess: () => onClose({}, "backdropClick") });
  const setPasswordMutation = useMutation({
    mutationFn: async (data: { email: string, password: string }) => {
      const { ok, error } = await signIn("credentials", { ...data, redirect: false });
      if (error === "CredentialsSignin") throw new Error("Invalid password");
      if (!ok) throw new Error("An error occured. Please try again");
    },
    onSuccess() {
      queryClient.invalidateQueries(["accounts"]);
      deleteAccountMutation.mutate(providerAccount?._id.toString());
    },
  });

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      {...props}
    >
      <form onSubmit={form.handleSubmit(data => setPasswordMutation.mutate(data))}>
        <DialogTitle>
          Create password
          <DialogCloseButton onClick={e => onClose(e, "backdropClick")} />
        </DialogTitle>

        <DialogContent>
          <Stack
            spacing={3}
            paddingY={1}
          >
            <Alert severity="info">
              You must create a password before unlinking the authorization provider
            </Alert>

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <LoginFormPasswordInput
                  label="New Password"
                  isNew
                  disabled={form.formState.isLoading}
                  fieldState={fieldState}
                  {...field}
                />
              )}
            />

            {
              setPasswordMutation.error instanceof Error && (
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
            onClick={e => onClose(e, "backdropClick")}
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