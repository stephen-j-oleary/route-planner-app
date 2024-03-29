import { bindHover, bindMenu, usePopupState } from "material-ui-popup-state/hooks";
import dynamic from "next/dynamic";
import React from "react";

import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Button, ButtonProps, MenuProps } from "@mui/material";

const ArrowUpIcon = dynamic(() => import("@mui/icons-material/KeyboardArrowUpRounded").then(mod => mod.default));
const HoverMenu = dynamic(() => import("material-ui-popup-state/HoverMenu").then(mod => mod.default));


export type DropdownButtonProps = Omit<ButtonProps, "endIcon" | "onTouchStart" | "onMouseOver" | "onMouseLeave"> & {
  menuProps?: Omit<MenuProps, "open">,
};

const DropdownButton = React.forwardRef<HTMLButtonElement, DropdownButtonProps>(function DropdownButton({
  menuProps = {},
  ...props
}, ref) {
  const popupId = React.useId();
  const popupState = usePopupState({
    popupId,
    variant: "popover",
  });

  return (
    <>
      <Button
        ref={ref}
        endIcon={popupState.isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
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
        {...menuProps}
      />
    </>
  );
});

export default DropdownButton;