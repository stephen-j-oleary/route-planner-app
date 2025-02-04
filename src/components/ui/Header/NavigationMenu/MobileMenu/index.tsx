// Don't use "use client" here. This component is passed non-serializable props so shouldn't be the client-server boundary
import "client-only";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { CloseRounded, MenuRounded } from "@mui/icons-material";
import { Backdrop, Box, Collapse, IconButton, List, ListItemButton, ListItemText, Tooltip } from "@mui/material";

import DropdownListItem from "@/components/ui/DropdownListItem";
import { BACKDROP_ID } from "@/components/ui/Header/Backdrop";
import { MENU_ID } from "@/components/ui/Header/Menu";
import { MenuProps } from "@/components/ui/Header/NavigationMenu";
import NextLinkComposed from "@/components/ui/NextLinkComposed";


export default function MobileMenu({
  pages,
  isPageActive,
  ...props
}: MenuProps) {
  const [menuPortal, setMenuPortal] = useState<Element | null>(null);
  const [backdropPortal, setBackdropPortal] = useState<Element | null>(null);

  useEffect(
    () => {
      setMenuPortal(document.getElementById(MENU_ID));
      setBackdropPortal(document.getElementById(BACKDROP_ID));
    },
    []
  );

  const [open, setOpen] = useState(false);
  const onToggle = () => setOpen(v => !v);


  const menuList = (
    <Collapse in={open} id="navigation-menu">
      <Box component="nav">
        <List>
          {
            pages.map(page => {
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
    </Collapse>
  );

  const backdrop = (
    <Backdrop
      open={open}
      onClick={onToggle}
    />
  );

  return (
    <Box {...props}>
      <Tooltip enterDelay={1000} title={open ? "Close navigation" : "Open navigation"}>
        <IconButton
          aria-label="Toggle navigation"
          aria-haspopup
          aria-controls={open ? "navigation-menu" : undefined}
          onClick={onToggle}
          color="inherit"
        >
          {open ? <CloseRounded /> : <MenuRounded />}
        </IconButton>
      </Tooltip>

      {
        menuPortal && createPortal(menuList, menuPortal)
      }

      {
        backdropPortal && createPortal(backdrop, backdropPortal)
      }
    </Box>
  );
}