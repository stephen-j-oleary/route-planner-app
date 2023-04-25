import { Button } from "@mui/material";

import ConfirmationDialog from "@/components/ConfirmationDialog";
import SubscriptionChangePreview from "@/components/Subscriptions/ChangePreview";


export default function SubscriptionFormConfirmationPreview({
  renderTriggerButton,
  productName,
  ...props
}) {
  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="sm"
      disablePortal
      title={`Subscribe to ${productName}`}
      renderTriggerButton={(triggerProps, dialogState) => (
        renderTriggerButton(
          { ...triggerProps, type: "button" }, // Add button type to ensure the trigger button does not submit the form
          dialogState
        )
      )}
      renderCancelButton={({ popupState }) => (
        <Button
          color="error"
          type="button"
          onClick={popupState.close}
        >
          Cancel
        </Button>
      )}
      renderConfirmButton={({ popupState }) => (
        <Button
          variant="contained"
          type="submit"
          onClick={popupState.close}
        >
          Subscribe
        </Button>
      )}
    >
      <SubscriptionChangePreview {...props} />
    </ConfirmationDialog>
  );
}