import { useRef } from "react";

import { AppBar, Box, Stack, styled, Toolbar, Typography } from "@mui/material";

import NavigationMenu from "./NavigationMenu";
import UserMenu from "./UserMenu";


export default function Header({ titleComponent = "h1", hideUser = false, disableOffset = false, ...props }) {
  const menuPortal = useRef(null);
  const backdropPortal = useRef(null);

  return (
    <>
      <AppBar position="fixed" color="background" {...props}>
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
            variant="h4"
            fontWeight={500}
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
              menuPortal={menuPortal.current}
              backdropPortal={backdropPortal.current}
            />

            {
              !hideUser
                && <UserMenu />
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
        !disableOffset
          && <Header.Offset />
      }

      <Box
        id="header-backdrop-portal"
        ref={backdropPortal}
        sx={{ zIndex: theme => theme.zIndex.appBar - 1 }}
      />
    </>
  );
}

Header.Offset = styled("div")(({ theme }) => theme.mixins.toolbar);