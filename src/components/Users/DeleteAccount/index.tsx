import { signOut } from "next-auth/react";

import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { Button } from "@mui/material";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useDeleteUser } from "@/reactQuery/useUsers";


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
  const deleteUserMutation = useDeleteUser({
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
          loading={deleteUserMutation.isLoading}
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
          onClick={() => deleteUserMutation.mutate(
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