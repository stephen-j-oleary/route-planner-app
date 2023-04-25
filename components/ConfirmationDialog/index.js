import { bindDialog, bindTrigger, usePopupState } from "material-ui-popup-state/hooks";
import { useId } from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

/**
 * @param {{ renderTriggerButton: (triggerProps: {}, dialogState: { popupState: import("material-ui-popup-state").Props}) => JSX.Element }} props
 * @returns
 */
export default function ConfirmationDialog({
  renderTriggerButton,
  renderConfirmButton,
  renderCancelButton,
  confirmButtonLabel = "Confirm",
  cancelButtonLabel = "Cancel",
  title,
  message = "",
  children,
  ...props
}) {
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
        <DialogTitle>
          {title}
        </DialogTitle>

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