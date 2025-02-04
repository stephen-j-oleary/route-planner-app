import "server-only";

import { cookies } from "next/headers";
import NextLink from "next/link";

import { AppBar, AppBarProps, Link, Stack, Toolbar } from "@mui/material";

import HeaderBackdrop from "./Backdrop";
import HeaderMenu from "./Menu";
import HeaderOffset from "./Offset";
import NavigationMenu from "@/components/ui/Header/NavigationMenu";
import UserMenu from "@/components/ui/Header/UserMenu";
import pages from "@/pages";
import auth from "@/utils/auth";
import pojo from "@/utils/pojo";


export type HeaderProps = Omit<AppBarProps, "position" | "color">;

export default async function Header(props: HeaderProps) {
  const session = pojo(await auth(cookies()).session());

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
            gridTemplateColumns: "1fr auto",
            gridTemplateRows: "1fr auto",
            columnGap: 4,
            paddingY: 1.5,
            color: "text.primary"
          }}
        >
          <Stack
            direction={{ xs: "row-reverse", sm: "row" }}
            justifyContent={{ xs: "flex-end", sm: "flex-start" }}
            spacing={4}
          >
            <Link
              component={NextLink}
              href={pages.root}
              underline="none"
              variant="h2"
              color="inherit"
            >
              Loop
            </Link>

            <NavigationMenu />
          </Stack>

          <Stack direction="row" justifyContent="flex-end">
            <UserMenu
              session={session}
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