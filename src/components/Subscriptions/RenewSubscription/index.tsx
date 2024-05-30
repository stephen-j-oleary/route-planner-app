import { MutateOptions, useMutation } from "@tanstack/react-query";
import Stripe from "stripe";

import { Button, MenuItem, MenuItemProps } from "@mui/material";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { updateUserSubscriptionById } from "@/services/subscriptions";


export type RenewSubscriptionProps =
  & MenuItemProps
  & MutateOptions<Stripe.Subscription, unknown, string>
  & { subscription: { id: string } };

export default function RenewSubscription({
  subscription,
  onSuccess,
  onError,
  onSettled,
  ...props
}: RenewSubscriptionProps) {
  const handleRenew = useMutation({
    mutationFn: (id: string) => updateUserSubscriptionById(
      id,
      { cancel_at_period_end: false },
    ),
  });


  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Renew subscription"
      message="Are you sure you want to renew this subscription?"
      renderTriggerButton={triggerProps => (
        <MenuItem
          dense
          disabled={handleRenew.isPending}
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
            subscription.id,
            {
              onSuccess,
              onError,
              onSettled(data, error, variables, context) {
                popupState.close();
                onSettled?.(data, error, variables, context);
              },
            }
          )}
        >
          Renew subscription
        </Button>
      )}
    />
  );
}