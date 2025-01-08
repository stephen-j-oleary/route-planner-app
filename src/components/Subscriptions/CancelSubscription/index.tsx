import "client-only";

import moment from "moment";
import { ReactNode, useTransition } from "react";

import { LoadingButton } from "@mui/lab";

import { deleteUserSubscriptionById, patchUserSubscriptionById } from "@/app/api/user/subscriptions/[id]/actions";
import ConfirmationDialog, { DialogTriggerProps } from "@/components/ui/ConfirmationDialog";


export type CancelSubscriptionProps = {
  subscription: {
    id: string,
    status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused",
    current_period_end: number,
  },
  renderTrigger: (props: DialogTriggerProps) => ReactNode,
};

export default function CancelSubscription({
  subscription,
  renderTrigger,
}: CancelSubscriptionProps) {
  const { status } = subscription;
  const canCancelAtEnd = ["active", "trialing"].includes(status);

  const [isPending, startTransition] = useTransition();

  const handleCancel = (id: string, cb: () => void) => startTransition(
    async () => {
      await (
        canCancelAtEnd
          ? patchUserSubscriptionById(id, { cancel_at_period_end: true })
          : deleteUserSubscriptionById(id)
      );
      cb();
    }
  );


  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Cancel subscription"
      message={`Are you sure you want to cancel this subscription? ${canCancelAtEnd ? `You will lose access on ${moment.unix(subscription.current_period_end).format("MMM D, yyyy")}` : "Your subscription will end immediately"}`}
      renderTriggerButton={renderTrigger}
      cancelButtonLabel="Back"
      renderConfirmButton={({ popupState }) => (
        <LoadingButton
          loading={isPending}
          color="error"
          onClick={() => handleCancel(
            subscription.id,
            () => popupState.close(),
          )}
        >
          Cancel subscription
        </LoadingButton>
      )}
    />
  );
}