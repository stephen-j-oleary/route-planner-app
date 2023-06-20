import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { signIn } from "next-auth/react";
import * as yup from "yup";
import YupPassword from "yup-password";

import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton, Stack } from "@mui/material";

import DialogCloseButton from "@/components/DialogCloseButton";
import ProvidersList from "@/components/SignInForm/ProvidersList";
import { useGetAccounts } from "@/shared/reactQuery/useAccounts";
import { useGetProviders } from "@/shared/reactQuery/useProviders";

YupPassword(yup);


const selectCredentialAccount = data => data?.find(item => item.provider === "credentials");

export default function LinkProvider(props) {
  const providers = useGetProviders({ initialData: {} });
  const credentialAccount = useGetAccounts({ select: selectCredentialAccount });

  const popupState = usePopupState({
    popupId: "formDialog",
    variant: "dialog",
  });


  if (!credentialAccount.isLoading && !credentialAccount.data) return null;
  if (credentialAccount.isLoading) return (
    <Skeleton variant="rounded">
      <Button {...props}>
        Link provider...
      </Button>
    </Skeleton>
  );

  return (
    <>
      <Button
        color="inherit"
        {...bindTrigger(popupState)}
        {...props}
      >
        Link provider...
      </Button>

      <LinkProviderDialog
        providers={providers.data}
        {...bindDialog(popupState)}
      />
    </>
  );
}

function LinkProviderDialog({
  providers = {},
  ...props
}) {
  // Destructure onClose here so it's passed to the Dialog component
  const { onClose } = props;

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
        <Stack
          spacing={3}
          paddingY={1}
        >
          <Alert severity="info">
            Linking an authorization provider will remove your password signin
          </Alert>

          <ProvidersList
            actionText="Link with"
            providers={Object.values(providers)}
            handleProviderSubmit={signIn}
          />
        </Stack>
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