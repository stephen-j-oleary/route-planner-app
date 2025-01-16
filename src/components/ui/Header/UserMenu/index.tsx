"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CloseRounded } from "@mui/icons-material";
import { Avatar, Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

import { AuthData, signOut } from "@/utils/auth";
import { getCountryFlag, getCountryName } from "@/utils/Radar/utils";
import { appendQuery } from "@/utils/url";
import pages from "pages";


export type UserMenuProps = {
  session: AuthData,
};

export default function UserMenu({
  session,
}: UserMenuProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);


  if (pathname === pages.login) return null;

  if (!session.userId) {
    return (
      <Button
        size="medium"
        variant="contained"
        component={Link}
        href={appendQuery(pages.login, { callbackUrl: pathname })}
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
        aria-label="Open user menu"
        onClick={() => setOpen(true)}
      >
        <Avatar sx={{ width: 40, height: 40 }} />
      </IconButton>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
        keepMounted
        PaperProps={{
          sx: {
            minWidth: "min(200px, 100vw)",
          },
        }}
      >
        <IconButton
          size="small"
          aria-label="Close user menu"
          onClick={() => setOpen(false)}
          sx={{ alignSelf: "flex-end", m: 1 }}
        >
          <CloseRounded />
        </IconButton>

        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href={pages.account.root}
              onClick={() => setOpen(false)}
            >
              <ListItemText
                primary="Account"
                secondary={session.email}
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Box flex="1 0 0" />

        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href={pages.account.editProfile}
              onClick={() => setOpen(false)}
            >
              <ListItemText
                primary="Country"
                secondary={session.countryCode ? `${getCountryFlag(session.countryCode)} ${getCountryName(session.countryCode)}` : "Unknown"}
              />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              href={pages.account.root}
              onClick={() => setOpen(false)}
            >
              <ListItemText>Settings</ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                signOut();
                setOpen(false);
              }}
            >
              <ListItemText>Sign Out</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}