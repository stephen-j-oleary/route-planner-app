import { bindHover, bindMenu, usePopupState } from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import React from "react";

import { KeyboardArrowDownRounded, KeyboardArrowUpRounded } from "@mui/icons-material";
import { Button, ButtonProps, MenuProps } from "@mui/material";


export type DropdownButtonProps =
  & Omit<ButtonProps, "endIcon" | "onTouchStart" | "onMouseOver" | "onMouseLeave">
  & {
    menuProps?: Omit<MenuProps, "open">,
  };

export default function DropdownButton({
  ref,
  menuProps = {},
  ...props
}: DropdownButtonProps) {
  const popupId = React.useId();
  const popupState = usePopupState({
    popupId,
    variant: "popover",
  });

  return (
    <>
      <Button
        ref={ref}
        endIcon={popupState.isOpen ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />}
        aria-label="Toggle sub-menu"
        aria-haspopup
        aria-expanded={popupState.isOpen}
        {...bindHover(popupState)}
        {...props}
      />

      <HoverMenu
        {...bindMenu(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        autoFocus
        disableAutoFocusItem
        disablePortal
        hideBackdrop
        keepMounted
        {...menuProps}
      />
    </>
  );
}