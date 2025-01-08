import { bindDialog, bindTrigger, PopupState, usePopupState } from "material-ui-popup-state/hooks";
import { ReactNode, useId } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";


export type DialogState = { popupState: PopupState };
export type DialogTriggerProps = ReturnType<typeof bindTrigger>;

export type ConfirmationDialogProps = Omit<DialogProps, "open" | "onClose"> & {
  renderTriggerButton: (triggerProps: DialogTriggerProps, dialogState: DialogState) => ReactNode,
  renderConfirmButton?: (dialogState: DialogState) => ReactNode,
  renderCancelButton?: (dialogState: DialogState) => ReactNode,
  confirmButtonLabel?: ReactNode,
  cancelButtonLabel?: ReactNode,
  title?: ReactNode,
  message?: ReactNode,
  children?: ReactNode,
};

export default function ConfirmationDialog({
  renderTriggerButton,
  renderConfirmButton,
  renderCancelButton,
  confirmButtonLabel = "Confirm",
  cancelButtonLabel = "Cancel",
  title,
  message,
  children,
  ...props
}: ConfirmationDialogProps) {
  const popupId = useId();
  const popupState = usePopupState({
    popupId,
    variant: "dialog",
  });


  return (
    <>
      {
        renderTriggerButton(
          bindTrigger(popupState),
          { popupState }
        )
      }

      <Dialog
        {...bindDialog(popupState)}
        {...props}
      >
        {
          title && (
            <DialogTitle>
              {title}
            </DialogTitle>
          )
        }

        <DialogContent>
          {
            message && (
              <DialogContentText>
                {message}
              </DialogContentText>
            )
          }

          {children}
        </DialogContent>

        <DialogActions>
          {
            renderCancelButton?.({ popupState })
              || (
                <Button
                  autoFocus
                  onClick={popupState.close}
                >
                  {cancelButtonLabel}
                </Button>
              )
          }

          {
            renderConfirmButton?.({ popupState })
              || (
                <Button
                  onClick={popupState.close}
                >
                  {confirmButtonLabel}
                </Button>
              )
          }
        </DialogActions>
      </Dialog>
    </>
  );
}