import "client-only";

import { ReactNode, useTransition } from "react";

import { LoadingButton } from "@mui/lab";

import { deleteUserPaymentMethodById } from "@/app/api/user/paymentMethods/[id]/actions";
import ConfirmationDialog, { DialogTriggerProps } from "@/components/ui/ConfirmationDialog";


export type DeletePaymentMethodProps = {
  paymentMethod: { id: string },
  renderTrigger: (props: DialogTriggerProps) => ReactNode,
};

export default function DeletePaymentMethod({
  paymentMethod,
  renderTrigger,
}: DeletePaymentMethodProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, cb: () => void) => startTransition(
    async () => {
      await deleteUserPaymentMethodById(id);
      cb();
    }
  );

  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Delete payment method"
      message="Are you sure you want to delete this payment method?"
      renderTriggerButton={renderTrigger}
      cancelButtonLabel="Cancel"
      renderConfirmButton={({ popupState }) => (
        <LoadingButton
          color="error"
          loading={isPending}
          onClick={() => handleDelete(
            paymentMethod.id,
            () => popupState.close(),
          )}
        >
          Delete payment method
        </LoadingButton>
      )}
    />
  );
}