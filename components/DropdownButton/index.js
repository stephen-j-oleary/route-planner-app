import { bindHover, bindMenu, usePopupState } from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import { forwardRef, useId } from "react";

import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { Button } from "@mui/material";


export default forwardRef(function DropdownButton({
  menuProps = {},
  ...props
}, ref) {
  const popupId = useId();
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