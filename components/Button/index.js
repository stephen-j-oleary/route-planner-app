
import { forwardRef } from "react";

import withTooltip from "../withTooltip";
import { Button as MuiButton } from "@mui/material";


const Button = forwardRef(function Button(props, ref) {
  return (
    <MuiButton
      ref={ref}
      {...props}
    />
  );
})

export default withTooltip(Button)
