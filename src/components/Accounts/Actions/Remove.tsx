import "client-only";

import { useMutation } from "@tanstack/react-query";
import { bindTrigger } from "material-ui-popup-state";
import React from "react";

import { Button, capitalize } from "@mui/material";

import { deleteUserAccountById } from "@/app/api/user/accounts/[id]/actions";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { IAccount } from "@/models/Account";


export type RemoveAccountProps = {
  account: Omit<IAccount, "_id"> & { id: string },
  renderTrigger: (props: ReturnType<typeof bindTrigger>) => React.ReactNode,
};

export default function RemoveAccount({
  account,
  renderTrigger,
}: RemoveAccountProps) {
  const deleteAccountMutation = useMutation({
    mutationFn: deleteUserAccountById,
  });

  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title={`Remove ${capitalize(account.provider)} sign in`}
      message="Are you sure you want to remove this sign in method?"
      renderTriggerButton={renderTrigger}
      cancelButtonLabel="Cancel"
      renderConfirmButton={({ popupState }) => (
        <Button
          color="error"
          onClick={() => deleteAccountMutation.mutate(
            account.id,
            { onSettled: () => void popupState.close() }
          )}
        >
          Remove sign in method
        </Button>
      )}
    />
  );
}