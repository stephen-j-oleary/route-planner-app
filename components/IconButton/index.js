
import { forwardRef } from "react";

import withTooltip from "../withTooltip";
import { IconButton as MuiIconButton } from "@mui/material";


const IconButton = forwardRef(function IconButton(props, ref) {
  return (
    <MuiIconButton
      ref={ref}
      {...props}
    />
  );
})

export default withTooltip(IconButton)
