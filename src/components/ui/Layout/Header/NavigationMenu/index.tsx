import { useRouter } from "next/router";
import React, { useCallback } from "react";

import { Stack, StackProps, useMediaQuery, useTheme } from "@mui/material";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";


type TPage = {
  name: string,
  path: string,
  pages?: TPage[],
};

const PAGES: TPage[] = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/plans" },
  {
    name: "Route",
    path: "/routes/create",
    pages: [
      { name: "Create a Route", path: "/routes/create" },
      { name: "View Routes", path: "/routes" },
    ]
  },
];


export type MenuProps = {
  pages: TPage[],
  isPageActive: (page: TPage) => boolean,
  menuPortal?: React.RefObject<HTMLDivElement | null>,
  backdropPortal?: React.RefObject<HTMLDivElement | null>,
};

export type NavigationMenuProps = StackProps & Omit<MenuProps, "pages" | "isPageActive">;

export default function NavigationMenu({
  menuPortal,
  backdropPortal,
  ...props
}: NavigationMenuProps) {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("sm"));
  const isMobile = useMediaQuery("(hover: none)");

  const { isReady, pathname } = useRouter();

  const isPageActive = useCallback(
    (page: TPage) => {
      if (!isReady) return false;
      return !!(
        pathname === page.path
          || page.pages?.some(isPageActive)
      );
    },
    [isReady, pathname]
  );

  const MenuComponent = (isLarge && !isMobile)
    ? DesktopMenu
    : MobileMenu;


  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      {...props}
    >
      <MenuComponent
        pages={PAGES}
        isPageActive={isPageActive}
        menuPortal={menuPortal}
        backdropPortal={backdropPortal}
      />
    </Stack>
  );
}