import { capitalize } from "lodash";
import { bindTrigger } from "material-ui-popup-state";
import React from "react";

import { Button } from "@mui/material";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { IAccount } from "@/models/Account";
import { useDeleteUserAccountById } from "@/reactQuery/useAccounts";


export type RemoveAccountProps = {
  account: IAccount,
  renderTrigger: (props: ReturnType<typeof bindTrigger>) => React.ReactNode,
};

export default function RemoveAccount({
  account,
  renderTrigger,
}: RemoveAccountProps) {
  const deleteAccountMutation = useDeleteUserAccountById();

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
            account._id.toString(),
            { onSettled: () => void popupState.close() }
          )}
        >
          Remove sign in method
        </Button>
      )}
    />
  );
}