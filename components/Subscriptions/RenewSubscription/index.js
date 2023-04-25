import { Button, MenuItem } from "@mui/material";

import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useUpdateSubscriptionById } from "@/shared/reactQuery/useSubscriptions";


export default function RenewSubscription({
  subscription,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}) {
  const handleRenew = useUpdateSubscriptionById();


  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Renew subscription"
      message="Are you sure you want to renew this subscription?"
      renderTriggerButton={triggerProps => (
        <MenuItem
          dense
          disabled={handleRenew.isLoading}
          {...props}
          {...triggerProps}
        >
          Renew subscription...
        </MenuItem>
      )}
      cancelButtonLabel="Back"
      renderConfirmButton={({ popupState }) => (
        <Button
          onClick={() => handleRenew.mutate(
            {
              id: subscription.id,
              cancel_at_period_end: false,
            },
            {
              onMutate(...args) {
                popupState.close();
                onMutate?.(...args);
              },
              onSuccess,
              onError,
              onSettled,
            }
          )}
        >
          Renew subscription
        </Button>
      )}
    />
  );
}