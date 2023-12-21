import moment from "moment";

import { Button, MenuItem } from "@mui/material";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useCancelSubscriptionAtPeriodEndById, useCancelSubscriptionById } from "@/reactQuery/useSubscriptions";


export interface CancelSubscriptionProps {
  subscription: {
    id: string,
    status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused",
    current_period_end: number,
  },
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
  const canCancelAtEnd = ["active", "trialing"].includes(status);

  const cancelMutation = useCancelSubscriptionById();
  const cancelAtEndMutation = useCancelSubscriptionAtPeriodEndById();

  const submitMutation = canCancelAtEnd ? cancelAtEndMutation : cancelMutation;


  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Cancel subscription"
      message={`Are you sure you want to cancel this subscription? ${canCancelAtEnd ? `You wil still have access until ${moment.unix(subscription.current_period_end).format("MMM D, yyyy")}` : "Your subscription will end immediately"}`}
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