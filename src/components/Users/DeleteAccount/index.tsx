// Don't use "use client" here. This component is passed non-serializable props so shouldn't be the client-server boundary
import "client-only";

import { ReactNode, useTransition } from "react";

import { LoadingButton } from "@mui/lab";

import { deleteUser } from "@/app/api/user/actions";
import ConfirmationDialog, { DialogTriggerProps } from "@/components/ui/ConfirmationDialog";
import { signOut } from "@/utils/auth/actions";


export type DeleteAccountProps = {
  renderTrigger: (props: DialogTriggerProps) => ReactNode,
};

export default function DeleteAccount({
  renderTrigger,
}: DeleteAccountProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (cb: () => void) => startTransition(
    async () => {
      await deleteUser();
      signOut();
      cb();
    },
  );


  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Delete account"
      message="Are you sure you want to delete your account? This action cannot be undone"
      renderTriggerButton={renderTrigger}
      /* renderTriggerButton={triggerProps => (
        <LoadingButton
          color="error"
          loading={isPending}
          disabled={!userId}
          {...triggerProps}
        >
          Delete account...
        </LoadingButton>
      )} */
      cancelButtonLabel="Cancel"
      renderConfirmButton={({ popupState }) => (
        <LoadingButton
          color="error"
          loading={isPending}
          onClick={() => handleDelete(
            () => popupState.close(),
          )}
        >
          Delete account
        </LoadingButton>
      )}
    />
  );
}