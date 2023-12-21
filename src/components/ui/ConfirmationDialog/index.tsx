import { bindDialog, bindTrigger, PopupState, usePopupState } from "material-ui-popup-state/hooks";
import React, { useId } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle } from "@mui/material";


type DialogState = { popupState: PopupState };

export type ConfirmationDialogProps = Omit<DialogProps, "open" | "onClose"> & {
  renderTriggerButton: (triggerProps: ReturnType<typeof bindTrigger>, dialogState: DialogState) => React.ReactNode,
  renderConfirmButton?: (dialogState: DialogState) => React.ReactNode,
  renderCancelButton?: (dialogState: DialogState) => React.ReactNode,
  confirmButtonLabel?: React.ReactNode,
  cancelButtonLabel?: React.ReactNode,
  title?: React.ReactNode,
  message?: React.ReactNode,
  children?: React.ReactNode,
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