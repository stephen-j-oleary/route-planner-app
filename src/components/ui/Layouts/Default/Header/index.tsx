import React, { useRef } from "react";

import { AppBar, AppBarProps, Box, Stack, styled, Toolbar, Typography } from "@mui/material";

import NavigationMenu from "./NavigationMenu";
import UserMenu from "./UserMenu";


export type HeaderProps = Omit<AppBarProps, "position" | "color"> & {
  titleComponent?: React.ElementType,
  hideUser?: boolean,
  disableOffset?: boolean,
};

export default function Header({
  titleComponent = "h1" as React.ElementType,
  hideUser = false,
  disableOffset = false,
  ...props
}) {
  const menuPortal = useRef<HTMLDivElement>(null);
  const backdropPortal = useRef<HTMLDivElement>(null);

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        {...props}
      >
        <Toolbar
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridTemplateRows: "1fr auto",
            columnGap: 2,
            paddingY: 1.5,
            color: "text.primary"
          }}
        >
          <Typography
            component={titleComponent}
            variant="h2"
            color="inherit"
          >
            Loop
          </Typography>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
          >
            <NavigationMenu
              flexGrow={1}
              menuPortal={menuPortal}
              backdropPortal={backdropPortal}
            />

            {
              !hideUser && <UserMenu />
            }
          </Stack>
        </Toolbar>

        <Box
          id="header-menu-portal"
          ref={menuPortal}
          sx={{ gridColumn: "1 / -1" }}
        />
      </AppBar>

      {
        !disableOffset && <Header.Offset />
      }

      <Box
        id="header-backdrop-portal"
        ref={backdropPortal}
        sx={{
          position: "fixed", // Create a stacking context so children are above app content
          zIndex: theme => theme.zIndex.appBar - 1,
        }}
      />
    </>
  );
}

Header.Offset = styled("div")(({ theme }) => theme.mixins.toolbar);