"use client";

import { useMutation } from "@tanstack/react-query";

import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import { Button } from "@mui/material";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { deleteUser } from "@/services/users";
import { signOut } from "@/utils/auth/client";


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
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
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
          loading={deleteUserMutation.isPending}
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
            undefined,
            {
              onSuccess() {
                popupState.close;
                signOut();
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