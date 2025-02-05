import "client-only";

import { useEffect, useState } from "react";

import { CloseRounded, MenuRounded } from "@mui/icons-material";
import { Box, BoxProps, Collapse, IconButton, List, ListItemButton, ListItemText, Tooltip } from "@mui/material";

import { useIsPageActive } from "../hooks";
import navigationPages from "../pages";
import DropdownListItem from "@/components/ui/DropdownListItem";
import NextLinkComposed from "@/components/ui/NextLinkComposed";


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
                navigationPages.map(page => {
                  const { path, name, pages } = page;

                  const sharedProps = {
                    component: NextLinkComposed,
                    to: path,
                    onClick: onToggle,
                    selected: isPageActive(page),
                    divider: true,
                    children: <ListItemText primary={name} primaryTypographyProps={{ paddingY: 1 }} />,
                  };

                  return pages
                    ? (
                      <DropdownListItem
                        key={path}
                        listProps={{
                          children: (
                            pages?.map((nestedPage) => (
                              <ListItemButton
                                key={nestedPage.path}
                                component={NextLinkComposed}
                                to={nestedPage.path}
                                onClick={onToggle}
                                selected={isPageActive(nestedPage)}
                                divider
                                sx={{ paddingLeft: 4 }}
                              >
                                <ListItemText primary={nestedPage.name} />
                              </ListItemButton>
                            ))
                          ),
                        }}
                        {...sharedProps}
                      />
                    )
                    : (
                      <ListItemButton
                        key={path}
                        {...sharedProps}
                      />
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