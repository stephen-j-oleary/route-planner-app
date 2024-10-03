"use client";

import { bindMenu, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import React from "react";

import { MoreVertRounded } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";

import ChangeAccount from "@/components/Accounts/Actions/Change";
import RemoveAccount from "@/components/Accounts/Actions/Remove";
import { IAccount } from "@/models/Account";
import { FromMongoose } from "@/utils/mongoose";


export type AccountActionsProps = {
  account: FromMongoose<IAccount>,
  allowRemove: boolean,
};

export default function AccountActions({
  account,
  allowRemove,
}: AccountActionsProps) {
  const popupId = React.useId();
  const popupState = usePopupState({ variant: "popover", popupId });

  const { provider } = account;


  return (
    <>
      <IconButton
        edge="end"
        aria-label="toggle-subscription-actions"
        {...bindToggle(popupState)}
      >
        <MoreVertRounded />
      </IconButton>

      <Menu
        {...bindMenu(popupState)}
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
          provider === "credentials" && (
            <ChangeAccount
              account={account}
              renderTrigger={props => (
                <MenuItem
                  dense
                  sx={{ color: "primary.main" }}
                  {...props}
                >
                  Change password...
                </MenuItem>
              )}
            />
          )
        }

        <RemoveAccount
          account={account}
          renderTrigger={props => (
            <MenuItem
              dense
              sx={{ color: "error.main" }}
              disabled={!allowRemove}
              {...props}
            >
              Remove...
            </MenuItem>
          )}
        />
      </Menu>
    </>
  );
}