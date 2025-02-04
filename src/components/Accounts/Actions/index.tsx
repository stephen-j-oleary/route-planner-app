"use client";

import { bindMenu, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import Link from "next/link";
import { useId } from "react";

import { MoreVertRounded } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";

import { IAccount } from "@/models/Account";
import pages from "@/pages";
import { FromMongoose } from "@/utils/mongoose";


export type AccountActionsProps = {
  account: FromMongoose<IAccount>,
};

export default function AccountActions({
  account,
}: AccountActionsProps) {
  const popupId = useId();
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
            <MenuItem
              dense
              component={Link}
              href={pages.account.changePassword}
              replace
              onClick={() => popupState.close()}
              sx={{ color: "primary.main" }}
            >
              Change password...
            </MenuItem>
          )
        }
      </Menu>
    </>
  );
}