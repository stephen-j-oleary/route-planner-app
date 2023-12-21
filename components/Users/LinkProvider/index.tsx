import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useRouter } from "next/router";
import * as yup from "yup";
import YupPassword from "yup-password";

import { Alert, Button, ButtonProps, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Skeleton, Stack } from "@mui/material";

import DialogCloseButton from "@/components/DialogCloseButton";
import ProvidersList from "@/components/LoginForm/ProvidersList";
import { useGetAccounts } from "@/shared/reactQuery/useAccounts";

YupPassword(yup);


const selectCredentialAccount = <TData extends { provider: string },>(data: TData[]) => data?.find(item => item.provider === "credentials");

export type LinkProviderProps = Omit<ButtonProps, "onClick" | "onTouchStart">;

export default function LinkProvider(props: LinkProviderProps) {
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
        {...bindDialog(popupState)}
      />
    </>
  );
}


export type LinkProviderDialogProps = DialogProps;

function LinkProviderDialog(props: LinkProviderDialogProps) {
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

        <DialogCloseButton onClick={e => onClose(e, "backdropClick")} />
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
            callbackUrl={router.asPath}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          onClick={e => onClose(e, "backdropClick")}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}