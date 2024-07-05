"use client";

import { useMutation } from "@tanstack/react-query";

import { Button, MenuItem, MenuItemProps } from "@mui/material";

import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { deleteUserPaymentMethodById } from "@/services/paymentMethods";


export type DeletePaymentMethodProps = MenuItemProps & {
  paymentMethod: { id: string },
  onSuccess?: () => void,
  onError?: () => void,
  onSettled?: (...args: unknown[]) => void,
};

export default function DeletePaymentMethod({
  paymentMethod,
  onSuccess,
  onError,
  onSettled,
  ...props
}: DeletePaymentMethodProps) {
  const handleDelete = useMutation({
    mutationFn: deleteUserPaymentMethodById,
  });

  return (
    <ConfirmationDialog
      fullWidth
      maxWidth="xs"
      title="Delete payment method"
      message="Are you sure you want to delete this payment method?"
      renderTriggerButton={triggerProps => (
        <MenuItem
          dense
          disabled={handleDelete.isPending}
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
              onSuccess,
              onError,
              onSettled(...args) {
                popupState.close();
                onSettled?.(...args);
              },
            }
          )}
        >
          Delete payment method
        </Button>
      )}
    />
  );
}