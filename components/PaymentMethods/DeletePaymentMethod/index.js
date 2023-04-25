import { Button, MenuItem } from "@mui/material";

import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useDeletePaymentMethodById } from "@/shared/reactQuery/usePaymentMethods";


export default function DeletePaymentMethod({
  paymentMethod,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  ...props
}) {
  const handleDelete = useDeletePaymentMethodById();

  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Delete payment method"
      message="Are you sure you want to delete this payment method?"
      renderTriggerButton={triggerProps => (
        <MenuItem
          dense
          disabled={handleDelete.isLoading}
          sx={{ color: "error.main" }}
          {...props}
          {...triggerProps}
        >
          Delete payment method...
        </MenuItem>
      )}
      cancelButtonLabel="Cancel"
      renderConfirmButton={({ popupState }) => (
        <Button
          color="error"
          onClick={() => handleDelete.mutate(
            paymentMethod.id,
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
          Delete payment method
        </Button>
      )}
    />
  );
}