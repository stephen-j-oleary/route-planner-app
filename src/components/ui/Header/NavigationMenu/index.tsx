"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { BoxProps, Stack, StackProps } from "@mui/material";

import DesktopMenu from "@/components/ui/Header/NavigationMenu/DesktopMenu";
import MobileMenu from "@/components/ui/Header/NavigationMenu/MobileMenu";


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


export type MenuProps =
  & (StackProps | BoxProps)
  &  {
    pages: TPage[],
    isPageActive: (page: TPage) => boolean,
  };

export type NavigationMenuProps = StackProps & Omit<MenuProps, "pages" | "isPageActive">;

export default function NavigationMenu(props: NavigationMenuProps) {
  const pathname = usePathname();

  const isPageActive = React.useCallback(
    (page: TPage) => !!(
      pathname === page.path
        || page.pages?.some(isPageActive)
    ),
    [pathname]
  );

  const menuProps = {
    pages: PAGES,
    isPageActive,
  };


  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      {...props}
    >
      <DesktopMenu
        {...menuProps}
        sx={{ display: { xs: "none", sm: "block" } }}
      />

      <MobileMenu
        {...menuProps}
        sx={{ display: { xs: "block", sm: "none" } }}
      />
    </Stack>
  );
}