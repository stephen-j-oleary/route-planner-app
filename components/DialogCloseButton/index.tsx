import React from "react";

import CloseIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, IconButtonProps } from "@mui/material";


export type DialogCloseButtonProps = IconButtonProps;

const DialogCloseButton = React.forwardRef<HTMLButtonElement, DialogCloseButtonProps>(function DialogCloseButton(props, ref) {
  return (
    <IconButton
      ref={ref}
      type="button"
      aria-label="Close"
      {...props}
      sx={{
        position: "absolute",
        inset: "8px 8px auto auto",
        color: theme => theme.palette.grey[500],
        ...props.sx,
      }}
    >
      <CloseIcon />
    </IconButton>
  )
});

export default DialogCloseButton;