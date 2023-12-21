import { signOut } from "next-auth/react";

import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { Button } from "@mui/material";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useDeleteAccountByUser } from "@/reactQuery/useAccounts";


export type DeleteAccountProps = LoadingButtonProps & {
  userId?: string,
  onMutate?: () => void,
  onSuccess?: () => void,
  onError?: () => void,
  onSettled?: () => void,
};

export default function DeleteAccount({
  userId,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}: DeleteAccountProps) {
  const deleteAccountMutation = useDeleteAccountByUser({
    onSuccess,
    onMutate,
    onError,
    onSettled,
  });

  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Delete account"
      message="Are you sure you want to delete your account? This action cannot be undone"
      renderTriggerButton={triggerProps => (
        <LoadingButton
          color="error"
          loadingPosition="center"
          loading={deleteAccountMutation.isLoading}
          disabled={!userId}
          {...props}
          {...triggerProps}
        >
          Delete account...
        </LoadingButton>
      )}
      cancelButtonLabel="Cancel"
      renderConfirmButton={({ popupState }) => (
        <Button
          color="error"
          onClick={() => deleteAccountMutation.mutate(
            userId,
            {
              onSuccess() {
                popupState.close;
                signOut({ redirect: false });
              },
            }
          )}
        >
          Yes, delete my account
        </Button>
      )}
    />
  );
}