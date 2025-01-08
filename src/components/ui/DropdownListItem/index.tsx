"use client";

import { ReactNode, useState } from "react";

import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { Collapse, IconButton, List, ListItemButton, ListItemButtonProps, ListProps } from "@mui/material";


export type DropdownListItemProps =
  & ListItemButtonProps
  & {
    children: ReactNode,
    listProps?: ListProps,
  };

export default function DropdownListItem({
  children,
  listProps = {},
  ...props
}: DropdownListItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(v => !v);

  return (
    <>
      <ListItemButton
        {...props}
      >
        {children}

        <IconButton
          size="medium"
          aria-label="Toggle sub-menu"
          aria-haspopup
          aria-expanded={isOpen}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            toggleOpen();
          }}
        >
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </IconButton>
      </ListItemButton>

      <Collapse in={isOpen}>
        <List
          disablePadding
          {...listProps}
        />
      </Collapse>
    </>
  );
}