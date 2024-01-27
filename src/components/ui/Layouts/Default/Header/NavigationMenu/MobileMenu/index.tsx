import Link from "next/link";
import React, { useState } from "react";
import { createPortal } from "react-dom";

import CloseIcon from "@mui/icons-material/CloseRounded";
import MenuIcon from "@mui/icons-material/MenuRounded";
import { Backdrop, Box, IconButton, List, ListItemButton, ListItemText, Collapse as MuiCollapse, Tooltip } from "@mui/material";

import DropdownListItem from "@/components/ui/DropdownListItem";
import { MenuProps } from "@/components/ui/Layouts/Default/Header/NavigationMenu";




export default function MobileMenu({
  pages,
  isPageActive,
  menuPortal,
  backdropPortal,
}: MenuProps) {
  const [open, setOpen] = useState(false);
  const onToggle = () => setOpen(v => !v);


  const menuList = (
    <MuiCollapse in={open} id="navigation-menu">
      <Box component="nav">
        <List>
          {
            pages.map(page => {
              const { path, name, pages } = page;
              const ListItemComponent = pages ? DropdownListItem : ListItemButton;

              return (
                <ListItemComponent
                  key={path}
                  component={Link}
                  href={path}
                  onClick={onToggle}
                  selected={isPageActive(page)}
                  divider
                  {...(pages ? {
                    listProps: {
                      children: (
                        pages?.map((nestedPage) => (
                          <ListItemButton
                            key={nestedPage.path}
                            component={Link}
                            href={nestedPage.path}
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
    </MuiCollapse>
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
          {open ? <CloseIcon /> : <MenuIcon />}
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