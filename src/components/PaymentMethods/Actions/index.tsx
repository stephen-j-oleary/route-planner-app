"use client";

import { bindMenu, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import Stripe from "stripe";

import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import { IconButton, Menu, MenuItem } from "@mui/material";

import DeletePaymentMethod from "@/components/PaymentMethods/Delete";


export type PaymentMethodActionsProps = {
  paymentMethod: Stripe.PaymentMethod,
}

export function PaymentMethodActions({
  paymentMethod,
}: PaymentMethodActionsProps) {
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
        keepMounted
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
          renderTrigger={({ onClick, ...params }) => (
            <MenuItem
              dense
              sx={{ color: "error.main" }}
              onClick={e => {
                dropdownState.close();
                onClick(e);
              }}
              {...params}
            >
              Delete payment method...
            </MenuItem>
          )}
        />
      </Menu>
    </>
  );
}