import "client-only";

import { ReactNode, useTransition } from "react";

import { LoadingButton } from "@mui/lab";

import { patchUserSubscriptionById } from "@/app/api/user/subscriptions/[id]/actions";
import ConfirmationDialog, { DialogTriggerProps } from "@/components/ui/ConfirmationDialog";


export type RenewSubscriptionProps = {
  subscription: { id: string },
  renderTrigger: (props: DialogTriggerProps) => ReactNode,
};

export default function RenewSubscription({
  subscription,
  renderTrigger,
}: RenewSubscriptionProps) {
  const [isPending, startTransition] = useTransition();

  const handleRenew = (id: string, cb: () => void) => startTransition(
    async () => {
      await patchUserSubscriptionById(id, { cancel_at_period_end: false });
      cb();
    }
  );


  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Renew subscription"
      message="Are you sure you want to renew this subscription?"
      renderTriggerButton={renderTrigger}
      cancelButtonLabel="Back"
      renderConfirmButton={({ popupState }) => (
        <LoadingButton
          loading={isPending}
          onClick={() => handleRenew(
            subscription.id,
            () => popupState.close(),
          )}
        >
          Renew subscription
        </LoadingButton>
      )}
    />
  );
}