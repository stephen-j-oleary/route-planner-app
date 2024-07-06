"use server";

import { cookies } from "next/headers";

import { AppBar, AppBarProps, Stack, Toolbar, Typography } from "@mui/material";

import HeaderBackdrop from "./Backdrop";
import HeaderMenu from "./Menu";
import HeaderOffset from "./Offset";
import NavigationMenu from "@/components/ui/Header/NavigationMenu";
import UserMenu from "@/components/ui/Header/UserMenu";
import { auth } from "@/utils/auth/server";


export type HeaderProps = Omit<AppBarProps, "position" | "color">;

export default async function Header(props: HeaderProps) {
  const session = await auth(cookies());

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
            component="p"
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
            />

            <UserMenu
              session={{ ...session }}
            />
          </Stack>
        </Toolbar>

        <HeaderMenu />
      </AppBar>

      <HeaderOffset />

      <HeaderBackdrop />
    </>
  );
}