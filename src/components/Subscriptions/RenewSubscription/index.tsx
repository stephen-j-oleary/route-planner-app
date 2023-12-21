import { MutateOptions } from "react-query";
import Stripe from "stripe";

import { Button, MenuItem, MenuItemProps } from "@mui/material";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { ApiPatchSubscriptionBody } from "@/pages/api/pay/subscriptions/[id]";
import { useUpdateSubscriptionById } from "@/reactQuery/useSubscriptions";


export type RenewSubscriptionProps =
  & MenuItemProps
  & MutateOptions<Stripe.Subscription, unknown, { id: string } & ApiPatchSubscriptionBody>
  & { subscription: { id: string } };

export default function RenewSubscription({
  subscription,
  onSuccess,
  onError,
  onSettled,
  ...props
}: RenewSubscriptionProps) {
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