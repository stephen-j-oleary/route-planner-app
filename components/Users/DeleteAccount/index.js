import { signOut } from "next-auth/react";

import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";

import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeleteUserById } from "@/shared/reactQuery/useUsers";


export default function DeleteAccount({
  user,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}) {
  const handleDeleteUser = useDeleteUserById();

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
          loading={handleDeleteUser.isLoading}
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
          onClick={() => handleDeleteUser.mutate(
            user._id,
            {
              onMutate(...args) {
                onMutate?.(...args);
                signOut({ redirect: false });
                popupState.close();
              },
              onSuccess,
              onError,
              onSettled,
            }
          )}
        >
          Yes, delete my account
        </Button>
      )}
    />
  );
}