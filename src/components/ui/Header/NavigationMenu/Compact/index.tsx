import "client-only";

import { useEffect, useState } from "react";

import { CloseRounded, MenuRounded } from "@mui/icons-material";
import { Box, BoxProps, Collapse, IconButton, List, ListItemButton, ListItemText, Tooltip } from "@mui/material";

import { useIsPageActive } from "../hooks";
import NextLinkComposed from "@/components/ui/NextLinkComposed";
import { navigation } from "@/pages";


const NAV_MENU_ID = "navigation-menu";

type NavigationMenuCompactToggleProps =
  & BoxProps
  & {
    open: boolean,
    onToggle: () => void,
  };

export function NavigationMenuCompactToggle({
  open,
  onToggle,
  ...props
}: NavigationMenuCompactToggleProps) {
  return (
    <Box {...props}>
      <Tooltip title={open ? "Close navigation" : "Open navigation"}>
        <IconButton
          aria-label="Toggle navigation"
          aria-haspopup
          aria-controls={open ? NAV_MENU_ID : undefined}
          onClick={onToggle}
          color="inherit"
        >
          {open ? <CloseRounded /> : <MenuRounded />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}


type NavigationMenuCompactProps = {
  open: boolean,
  onToggle: () => void,
};

export default function NavigationMenuCompact({
  open,
  onToggle,
}: NavigationMenuCompactProps) {
  const isPageActive = useIsPageActive();

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(
    () => setIsHydrated(true),
    []
  );

  return (
    <Collapse in={open} id={NAV_MENU_ID}>
      {
        isHydrated && (
          <Box component="nav">
            <List>
              {
                navigation.map(([name, path]) => {

                  return (
                    <ListItemButton
                      key={path}
                      component={NextLinkComposed}
                      to={path}
                      onClick={onToggle}
                      selected={isPageActive(path)}
                      divider
                    >
                      <ListItemText
                        primary={name}
                        slotProps={{ primary: { paddingY: 1 } }}
                      />
                    </ListItemButton>
                  );
                })
              }
            </List>
          </Box>
        )
      }
    </Collapse>
  );
}