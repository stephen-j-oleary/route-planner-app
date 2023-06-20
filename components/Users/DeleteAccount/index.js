import { signOut } from "next-auth/react";

import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";

import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeleteAccountByUser } from "@/shared/reactQuery/useAccounts";
import { useDeleteUserById } from "@/shared/reactQuery/useUsers";


export default function DeleteAccount({
  user,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}) {
  const deleteUserMutation = useDeleteUserById({
    onSuccess(...args) {
      onSuccess?.(...args);
      signOut({ redirect: false });
    },
    onMutate,
    onError,
    onSettled,
  });
  const deleteAccountMutation = useDeleteAccountByUser();

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
          loading={
            deleteUserMutation.isLoading
            || deleteAccountMutation.isLoading
          }
          disabled={!user}
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
          onClick={() => {
            deleteUserMutation.mutate(
              user._id,
              { onMutate: popupState.close }
            );
            deleteAccountMutation.mutate(user._id);
          }}
        >
          Yes, delete my account
        </Button>
      )}
    />
  );
}