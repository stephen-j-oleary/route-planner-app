"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { CloseOutlined } from "@mui/icons-material";
import { IconButton, IconButtonProps } from "@mui/material";


export type DialogCloseProps =
  & Omit<IconButtonProps, "onClick">
  & {
    onClose?: () => void,
    closeHref?: string,
  };

export default function DialogClose({
  onClose,
  closeHref,
  ...props
}: DialogCloseProps) {
  const router = useRouter();
  const _onClose = onClose || (() => closeHref ? router.replace(closeHref) : router.back());


  return (
    <IconButton
      type="button"
      aria-label="Close"
      onClick={_onClose}
      {...props}
      sx={{
        position: "absolute",
        inset: "8px 8px auto auto",
        color: theme => theme.palette.grey[500],
        ...props.sx,
      }}
    >
      <CloseOutlined />
    </IconButton>
  );
}