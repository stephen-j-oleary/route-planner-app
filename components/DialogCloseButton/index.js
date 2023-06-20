import { forwardRef } from "react";

import CloseIcon from "@mui/icons-material/CloseOutlined";
import { IconButton } from "@mui/material";


const DialogCloseButton = forwardRef(function DialogCloseButton(props, ref) {
  return (
    <IconButton
      ref={ref}
      type="button"
      aria-label="Close"
      sx={{
        position: "absolute",
        inset: "8px 8px auto auto",
        color: theme => theme.palette.grey[500],
      }}
      {...props}
    >
      <CloseIcon />
    </IconButton>
  )
});

export default DialogCloseButton;