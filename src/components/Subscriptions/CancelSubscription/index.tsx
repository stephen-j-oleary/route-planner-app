"use client";

import { useMutation } from "@tanstack/react-query";
import moment from "moment";

import { Button, MenuItem } from "@mui/material";

import { deleteUserSubscriptionById, patchUserSubscriptionById } from "@/app/api/user/subscriptions/[id]/actions";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";


export type CancelSubscriptionProps = {
  subscription: {
    id: string,
    status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused",
    current_period_end: number,
  },
  onSettled?: () => void,
};

export default function CancelSubscription({
  subscription,
  onSettled,
  ...props
}: CancelSubscriptionProps) {
  const { status } = subscription;
  const canCancelAtEnd = ["active", "trialing"].includes(status);

  const submitMutation = useMutation({
    mutationFn: async (id: string) => await (
      canCancelAtEnd
        ? deleteUserSubscriptionById(id)
        : patchUserSubscriptionById(id, { cancel_at_period_end: true })
    ),
  });


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
          disabled={submitMutation.isPending}
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
              onSettled: () => {
                popupState.close();
                onSettled?.();
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