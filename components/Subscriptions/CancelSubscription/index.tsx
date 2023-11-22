import moment from "moment";
import { useMemo } from "react";
import Stripe from "stripe";

import { Button, MenuItem } from "@mui/material";

import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useCancelSubscriptionAtPeriodEndById, useCancelSubscriptionById } from "@/shared/reactQuery/useSubscriptions";


export interface CancelSubscriptionProps {
  subscription: Stripe.Subscription,
  onSuccess?: (...args: unknown[]) => void,
  onError?: (...args: unknown[]) => void,
  onSettled?: (...args: unknown[]) => void,
}

export default function CancelSubscription({
  subscription,
  onSuccess,
  onError,
  onSettled,
  ...props
}: CancelSubscriptionProps) {
  const { status } = subscription;
  const shouldCancelAtEnd = ["active", "trialing"].includes(status);

  const cancelMutation = useCancelSubscriptionById();
  const cancelAtEndMutation = useCancelSubscriptionAtPeriodEndById();

  const submitMutation = useMemo(
    () => shouldCancelAtEnd ? cancelAtEndMutation : cancelMutation,
    [shouldCancelAtEnd, cancelAtEndMutation, cancelMutation]
  );


  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Cancel subscription"
      message={`Are you sure you want to cancel this subscription? ${shouldCancelAtEnd ? `You will still have access until ${moment.unix(subscription.current_period_end).format("MMM D, yyyy")}` : "It will be canceled immediately"}`}
      renderTriggerButton={triggerProps => (
        <MenuItem
          dense
          sx={{ color: "error.main" }}
          disabled={submitMutation.isLoading}
          {...props}
          {...triggerProps}
        >
          Cancel subscription...
        </MenuItem>
      )}
      cancelButtonLabel="Back"
      renderConfirmButton={({ popupState }) => (
        <Button
          color="error"
          onClick={() => submitMutation.mutate(
            subscription.id,
            {
              onSuccess,
              onError,
              onSettled(...args) {
                popupState.close();
                onSettled?.(...args);
              },
            }
          )}
        >
          Cancel subscription
        </Button>
      )}
    />
  );
}