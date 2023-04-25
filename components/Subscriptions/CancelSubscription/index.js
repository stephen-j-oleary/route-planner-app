import moment from "moment";
import { useMutation } from "react-query";

import { Button, MenuItem } from "@mui/material";

import SelectDialog from "@/components/SelectDialog";
import { useGetUpcomingInvoice } from "@/shared/reactQuery/useInvoices";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { useDeleteSubscriptionById, useUpdateSubscriptionById } from "@/shared/reactQuery/useSubscriptions";


export default function CancelSubscription({
  subscription,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}) {
  const authUser = useGetSession({ select: selectUser });

  const upcomingInvoice = useGetUpcomingInvoice({
    customer: authUser.data?.customerId,
    subscription: subscription.id,
  });

  const handleDeleteSubscription = useDeleteSubscriptionById();
  const handleUpdateSubscription = useUpdateSubscriptionById();
  const handleCancel = useMutation(
    async ({ value, subscription }) => {
      return value === "immediate"
        ? handleDeleteSubscription.mutateAsync(subscription.id)
        : handleUpdateSubscription.mutateAsync({
          id: subscription.id,
          cancel_at_period_end: true
        });
    }
  );

  const isCancelScheduled = !!(subscription.cancel_at_period_end || subscription.cancel_at);
  const cancelButtonLabel = `Cancel subscription${isCancelScheduled ? " now" : ""}...`;


  return (
    <SelectDialog
      fullWidth
      maxWidth="xs"
      title="Cancel subscription"
      message="Are you sure you want to cancel this subscription?"
      defaultValue="end_of_cycle"
      options={[
        {
          value: "end_of_cycle",
          primary: "Cancel at end of billing cycle",
          secondary: `Subscription will end on ${moment.unix(subscription.current_period_end).format("MMM Do, YYYY")}`,
        },
        {
          value: "immediate",
          primary: "Cancel immediately",
          secondary: `You will be charged $${upcomingInvoice.data?.total / 100} based on your current usage`,
        },
      ]}
      renderTriggerButton={triggerProps => (
        <MenuItem
          dense
          sx={{ color: "error.main" }}
          disabled={handleDeleteSubscription.isLoading || handleUpdateSubscription.isLoading}
          {...props}
          {...triggerProps}
        >
          {cancelButtonLabel}
        </MenuItem>
      )}
      cancelButtonLabel="Back"
      renderConfirmButton={(value, { popupState }) => (
        <Button
          color="error"
          onClick={() => handleCancel.mutate(
            { value, subscription },
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
          Cancel subscription
        </Button>
      )}
    />
  );
}