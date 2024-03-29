import { bindMenu, bindToggle, usePopupState } from "material-ui-popup-state/hooks";

import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import { IconButton, Menu } from "@mui/material";

import DeletePaymentMethod from "@/components/PaymentMethods/Delete";


export function PaymentMethodActions({ paymentMethod }) {
  const dropdownState = usePopupState({ variant: "popover", popupId: "payment-method-actions" });


  return (
    <>
      <IconButton
        edge="end"
        aria-label="toggle-payment-method-actions"
        {...bindToggle(dropdownState)}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        {...bindMenu(dropdownState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <DeletePaymentMethod
          paymentMethod={paymentMethod}
          onSuccess={dropdownState.close}
        />
      </Menu>
    </>
  );
}