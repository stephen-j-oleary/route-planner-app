import { bindMenu, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import Stripe from "stripe";

import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import { IconButton, Menu } from "@mui/material";

import CancelSubscription from "@/components/Subscriptions/CancelSubscription";
import ChangeSubscription from "@/components/Subscriptions/ChangeSubscription";
import RenewSubscription from "@/components/Subscriptions/RenewSubscription";


export type SubscriptionActionsProps = {
  subscription: Stripe.Subscription,
};

export function SubscriptionActions({ subscription }: SubscriptionActionsProps) {
  const dropdownState = usePopupState({ variant: "popover", popupId: "subscription-actions" });

  const isCancelScheduled = !!(subscription.cancel_at_period_end || subscription.cancel_at);
  const isRenewable = !!subscription.cancel_at_period_end;


  return (
    <>
      <IconButton
        edge="end"
        aria-label="toggle-subscription-actions"
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
        {
          !isCancelScheduled && (
            <ChangeSubscription
              onClick={dropdownState.close}
            />
          )
        }

        {
          isRenewable && (
            <RenewSubscription
              subscription={subscription}
              onSettled={dropdownState.close}
            />
          )
        }

        {
          !isCancelScheduled && (
            <CancelSubscription
              subscription={subscription}
              onSettled={dropdownState.close}
            />
          )
        }
      </Menu>
    </>
  );
}