import { bindMenu, bindToggle, usePopupState } from "material-ui-popup-state/hooks";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { Avatar, Button, Divider, IconButton, Menu, MenuItem } from "@mui/material";

import useUserAvatar from "@/hooks/useUserAvatar";


export default function UserMenu() {
  const popupState = usePopupState({
    variant: "popover",
    popupId: "user-menu",
  });

  const session = useSession();
  const handleClose = (action?: () => void) => {
    popupState.close();
    action?.();
  };

  const userAvatar = useUserAvatar({ size: 40 });
  const UserAvatar = () => <Avatar {...userAvatar.getProps()} />;


  if (session.status === "loading") return <UserAvatar />;

  if (session.status === "authenticated") {
    return (
      <>
        <IconButton
          size="small"
          sx={{ padding: 0 }}
          aria-label="Toggle user menu"
          {...bindToggle(popupState)}
        >
          <UserAvatar />
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
          PaperProps={{
            sx: {
              minWidth: "min(100px, 100vw)"
            }
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
            onClick={() => handleClose(() => signOut({ redirect: false }))}
            sx={{ justifyContent: "flex-end" }}
          >
            Sign Out
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Button
      size="medium"
      variant="contained"
      onClick={() => signIn()}
      aria-label="Sign in"
    >
      Sign In
    </Button>
  );
}