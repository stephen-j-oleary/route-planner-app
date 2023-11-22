import { bindMenu, bindToggle, usePopupState } from "material-ui-popup-state/hooks";

import MoreVertIcon from "@mui/icons-material/MoreVertRounded";
import { IconButton, Menu } from "@mui/material";

import CancelSubscription from "@/components/Subscriptions/CancelSubscription";
import ChangeSubscription from "@/components/Subscriptions/ChangeSubscription";
import RenewSubscription from "@/components/Subscriptions/RenewSubscription";
import popoverOrigin from "@/shared/utils/popoverOrigin";


export function SubscriptionActions({ subscription }) {
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
        {...popoverOrigin("bottom right", "top right")}
      >
        {
          !isCancelScheduled && (
            <ChangeSubscription
              subscription={subscription}
              onClick={dropdownState.close}
            />
          )
        }

        {
          isRenewable && (
            <RenewSubscription
              subscription={subscription}
              onMutate={dropdownState.close}
            />
          )
        }

        {
          !isCancelScheduled && (
            <CancelSubscription
              subscription={subscription}
              onSuccess={dropdownState.close}
            />
          )
        }
      </Menu>
    </>
  );
}