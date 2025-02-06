"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ArrowForwardRounded, CloseRounded, PersonRounded } from "@mui/icons-material";
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Tooltip } from "@mui/material";

import pages, { user } from "@/pages";
import { signOut } from "@/utils/auth/actions";
import { AuthData } from "@/utils/auth/utils";
import { getCountryFlag, getCountryName } from "@/utils/Radar/utils";
import { appendQuery } from "@/utils/url";


export default function UserMenu({
  session,
}: {
  session: AuthData | undefined,
}) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  if (pathname?.startsWith(pages.login) || pathname?.startsWith(pages.verify))
    return null;

  if (!session?.user?.id) {
    return (
      <Stack direction="row" spacing={1}>
        <Button
          size="medium"
          variant="text"
          component={Link}
          href={appendQuery(pages.login, { callbackUrl: pages.routes.new })}
        >
          Login
        </Button>

        <Button
          size="medium"
          variant="contained"
          component={Link}
          href={pages.routes.new}
          endIcon={<ArrowForwardRounded />}
        >
          Get started
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        {
          !pathname?.startsWith(pages.routes.id) && (
            <Button
              size="medium"
              variant="contained"
              component={Link}
              href={pages.routes.new}
              endIcon={<ArrowForwardRounded />}
            >
              Create a route
            </Button>
          )
        }

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
      </Stack>

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
              onClick={() => setOpen(false)}
            >
              <ListItemText
                primary="Account"
                secondary={session.user.email}
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
                <ListItemButton
                  component={Link}
                  href={path}
                  onClick={() => {
                    if (name === "Sign out") signOut();
                    setOpen(false);
                  }}
                >
                  <ListItemText
                    primary={name}
                    secondary={name === "Country" && (
                      session.user?.countryCode
                        ? `${getCountryFlag(session.user.countryCode)} ${getCountryName(session.user.countryCode)}`
                        : "Unknown"
                    )}
                  />
                </ListItemButton>
              </ListItem>
            )))
          }
        </List>
      </Drawer>
    </>
  );
}