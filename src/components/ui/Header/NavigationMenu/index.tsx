"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { BoxProps, Stack, StackProps } from "@mui/material";

import DesktopMenu from "@/components/ui/Header/NavigationMenu/DesktopMenu";
import MobileMenu from "@/components/ui/Header/NavigationMenu/MobileMenu";
import pages from "pages";


type TPage = {
  name: string,
  path: string,
  pages?: TPage[],
};

const PAGES: TPage[] = [
  { name: "Home", path: pages.root },
  { name: "Pricing", path: pages.plans },
  {
    name: "Route",
    path: pages.routes.new,
    pages: [
      { name: "Create a Route", path: pages.routes.new },
      { name: "View Routes", path: pages.routes.root },
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

  const isPageActive = useCallback(
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