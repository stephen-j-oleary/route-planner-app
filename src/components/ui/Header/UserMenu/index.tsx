"use client";

import { bindMenu, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import Link from "next/link";

import { Button, Divider, IconButton, Menu, MenuItem } from "@mui/material";

import UserAvatar from "@/components/Users/Avatar";
import { AuthData } from "@/utils/auth";
import { signOut } from "@/utils/auth/client";


export type UserMenuProps = {
  session: AuthData,
};

export default function UserMenu({
  session,
}: UserMenuProps) {
  const popupState = usePopupState({
    variant: "popover",
    popupId: "user-menu",
  });

  const handleClose = (action?: () => void) => {
    popupState.close();
    action?.();
  };


  if (!session.userId) {
    return (
      <Button
        size="medium"
        variant="contained"
        component={Link}
        href="/login"
        aria-label="Sign in"
      >
        Sign In
      </Button>
    );
  }

  return (
    <>
      <IconButton
        size="small"
        sx={{ padding: 0 }}
        aria-label="Toggle user menu"
        {...bindToggle(popupState)}
      >
        <UserAvatar session={session} />
      </IconButton>

      <Menu
        {...bindMenu(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        keepMounted
        slotProps={{
          paper: {
            sx: { minWidth: "min(100px, 100vw)" },
          },
        }}
      >
        <MenuItem
          component={Link}
          href="/account"
          onClick={() => handleClose()}
          sx={{ justifyContent: "flex-end" }}
        >
          Account
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => handleClose(signOut)}
          sx={{ justifyContent: "flex-end" }}
        >
          Sign Out
        </MenuItem>
      </Menu>
    </>
  );
}