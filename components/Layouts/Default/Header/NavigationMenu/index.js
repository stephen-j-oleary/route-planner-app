import { useRouter } from "next/router";
import { useCallback } from "react";

import { Stack, useMediaQuery, useTheme } from "@mui/material";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";


const PAGES = [
  { name: "Home", path: "/" },
  {
    name: "Route",
    path: "/routes/create",
    pages: [
      { name: "Create a Route", path: "/routes/create" },
      { name: "View Routes", path: "/routes" },
    ]
  },
];


export default function NavigationMenu({
  menuPortal,
  backdropPortal,
  ...props
}) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useMediaQuery("(hover: none)");

  const { isReady, pathname } = useRouter();

  const isPageActive = useCallback(
    page => {
      if (!isReady) return false;
      return (
        pathname === page.path
        || page.pages?.some(isPageActive)
      );
    },
    [isReady, pathname]
  );

  const MenuComponent = (isSmall || isMobile)
    ? MobileMenu
    : DesktopMenu;


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