"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SWRResponse } from "swr";

import { CloseRounded, PersonRounded } from "@mui/icons-material";
import { Box, BoxProps, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Tooltip } from "@mui/material";

import pages, { user } from "@/pages";
import { signOut } from "@/utils/auth/actions";
import { AuthData } from "@/utils/auth/utils";
import { getCountryFlag, getCountryName } from "@/utils/Radar/utils";
import { appendQuery } from "@/utils/url";


type UserMenuProps =
  & {
    session: SWRResponse<AuthData>,
    onClick?: () => void,
  }
  & BoxProps;

export default function UserMenu({
  session,
  onClick,
  ...props
}: UserMenuProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  if (session.isLoading) return null;

  if (
    pathname?.startsWith(pages.login)
    || pathname?.startsWith(pages.verify)
  ) return null;

  return (
    <Box {...props}>
      {
        session.data?.user?.id
          ? (
            <>
              <Tooltip title="Open user menu">
                <IconButton
                  aria-label="Open user menu"
                  aria-haspopup
                  size="medium"
                  onClick={() => setOpen(true)}
                >
                  <PersonRounded />
                </IconButton>
              </Tooltip>

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
                        secondary={session.data.user.email}
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
            </>
          )
          : (
            <Button
              size="medium"
              variant="text"
              component={Link}
              href={appendQuery(pages.login, { callbackUrl: pages.routes.new })}
            >
              Login
            </Button>
          )
      }
    </Box>
  );
}