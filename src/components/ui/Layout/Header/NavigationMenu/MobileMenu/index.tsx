import dynamic from "next/dynamic";
import React, { useState } from "react";
import { createPortal } from "react-dom";

import MenuRounded from "@mui/icons-material/MenuRounded";
import { IconButton, Tooltip } from "@mui/material";

import { MenuProps } from "@/components/ui/Layout/Header/NavigationMenu";
import NextLinkComposed from "@/components/ui/NextLinkComposed";

const Collapse = dynamic(() => import("@mui/material/Collapse").then(mod => mod.default));
const Box = dynamic(() => import("@mui/material/Box").then(mod => mod.default));
const List = dynamic(() => import("@mui/material/List").then(mod => mod.default));
const ListItemButton = dynamic(() => import("@mui/material/ListItemButton").then(mod => mod.default));
const ListItemText = dynamic(() => import("@mui/material/ListItemText").then(mod => mod.default));
const Backdrop = dynamic(() => import("@mui/material/Backdrop").then(mod => mod.default));
const CloseRounded = dynamic(() => import("@mui/icons-material/CloseRounded").then(mod => mod.default));

const DropdownListItem = dynamic(() => import("@/components/ui/DropdownListItem").then(mod => mod.default));


export default function MobileMenu({
  pages,
  isPageActive,
  menuPortal,
  backdropPortal,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const onToggle = () => setOpen(v => !v);


  const menuList = (
    <Collapse in={open} id="navigation-menu">
      <Box component="nav">
        <List>
          {
            pages.map(page => {
              const { path, name, pages } = page;
              const ListItemComponent = pages ? DropdownListItem : ListItemButton;

              return (
                <ListItemComponent
                  key={path}
                  component={NextLinkComposed}
                  to={path}
                  onClick={onToggle}
                  selected={isPageActive(page)}
                  divider
                  {...(pages ? {
                    listProps: {
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
                    }
                  } : {})}
                >
                  <ListItemText primary={name} primaryTypographyProps={{ paddingY: 1 }} />
                </ListItemComponent>
              )
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
    <>
      <Tooltip enterDelay={1000} title={open ? "Close navigation" : "Open navigation"}>
        <IconButton
          aria-label="Toggle navigation"
          aria-haspopup
          aria-controls={open ? "navigation-menu" : undefined}
          onClick={onToggle}
          color="inherit"
          disabled={
            (menuPortal && !menuPortal.current)
              || (backdropPortal && !backdropPortal.current)
          }
        >
          {open ? <CloseRounded /> : <MenuRounded />}
        </IconButton>
      </Tooltip>

      {
        menuPortal
          ? menuPortal.current && createPortal(menuList, menuPortal.current)
          : menuList
      }

      {
        backdropPortal
          ? backdropPortal.current && createPortal(backdrop, backdropPortal.current)
          : backdrop
      }
    </>
  );
}