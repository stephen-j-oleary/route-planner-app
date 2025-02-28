import Link from "next/link";
import { SWRResponse } from "swr";

import { CloseRounded } from "@mui/icons-material";
import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Tooltip } from "@mui/material";

import pages, { user } from "@/pages";
import { signOut } from "@/utils/auth/actions";
import { AuthData } from "@/utils/auth/utils";
import { getCountryFlag, getCountryName } from "@/utils/Radar/utils";


export default function UserMenuMenu({
  session,
  open,
  setOpen,
  onClick,
}: {
  session: SWRResponse<AuthData>
  open: boolean,
  setOpen: (value: boolean) => void,
  onClick?: () => void,
}) {
  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      anchor="right"
      keepMounted
      PaperProps={{
        sx: {
          minWidth: "min(250px, 100vw)",
        },
      }}
    >
      <Tooltip title="Close user menu">
        <IconButton
          aria-label="Close user menu"
          size="medium"
          onClick={() => setOpen(false)}
          sx={{ alignSelf: "flex-end", mt: 2, mb: 1, mx: 3 }}
        >
          <CloseRounded />
        </IconButton>
      </Tooltip>

      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href={pages.account.root}
            onClick={() => {
              setOpen(false);
              onClick?.();
            }}
          >
            <ListItemText
              primary="Account"
              secondary={session.data?.user?.email}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Box flex="1 0 0" />

      <List>
        {
          user.map((([name, path]) => (
            <ListItem
              key={name}
              disablePadding
            >
              {
                name === "Sign out" ? (
                  <ListItemButton
                    onClick={() => {
                      signOut();
                      setOpen(false);
                      onClick?.();
                    }}
                  >
                    <ListItemText primary={name} />
                  </ListItemButton>
                ) : (
                  <ListItemButton
                    component={Link}
                    href={path}
                    onClick={() => {
                      setOpen(false);
                      onClick?.();
                    }}
                  >
                    <ListItemText
                      primary={name}
                      secondary={name === "Country" && (
                        session.data?.user?.countryCode
                          ? `${getCountryFlag(session.data.user.countryCode)} ${getCountryName(session.data.user.countryCode)}`
                          : "Unknown"
                      )}
                    />
                  </ListItemButton>
                )
              }
            </ListItem>
          )))
        }
      </List>
    </Drawer>
  );
}