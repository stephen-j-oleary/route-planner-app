import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useRouter } from "next/router";
import React from "react";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import ProvidersList, { ProvidersListProps } from "@/components/Providers/List";
import DialogCloseButton from "@/components/ui/DialogCloseButton";
import { IUser } from "@/models/User";
import { useGetUser } from "@/reactQuery/useUsers";


export type AddAccountProps = {
  renderTrigger: (props: ReturnType<typeof bindTrigger> & { disabled: boolean }) => React.ReactNode,
  providersQuery: AddAccountDialogProps["providersQuery"],
};

export default function AddAccount({ renderTrigger, providersQuery }: AddAccountProps) {
  const user = useGetUser();

  const popupState = usePopupState({
    popupId: "formDialog",
    variant: "dialog",
  });

  return (
    <>
      {renderTrigger({ ...bindTrigger(popupState), disabled: !user.data })}

      <AddAccountDialog
        providersQuery={providersQuery}
        user={user.data}
        {...bindDialog(popupState)}
      />
    </>
  );
}


export type AddAccountDialogProps = {
  providersQuery: ProvidersListProps["providersQuery"],
  user: IUser | undefined | null,
  open: boolean,
  onClose: (e: React.SyntheticEvent) => void,
};

function AddAccountDialog({
  providersQuery,
  user,
  ...props
}: AddAccountDialogProps) {
  // Destructure onClose here so it's passed to the Dialog component
  const { onClose } = props;
  const router = useRouter();

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      {...props}
    >
      <DialogTitle>
        Link provider

        <DialogCloseButton onClick={onClose} />
      </DialogTitle>

      <DialogContent>
        <Box paddingY={1}>
          <ProvidersList
            providersQuery={providersQuery}
            actionText="Link with"
            callbackUrl={router.asPath}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}