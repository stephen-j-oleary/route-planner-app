"use client";

import { useRouter } from "next/navigation";

import { Dialog as MuiDialog, DialogProps as MuiDialogProps } from "@mui/material";


export type DialogProps =
  & MuiDialogProps
  & {
    closeHref?: string,
  };

export default function Dialog({
  onClose,
  closeHref,
  ...props
}: DialogProps) {
  const router = useRouter();

  const _onClose = onClose || (() => closeHref ? router.replace(closeHref) : router.back());

  return (
    <MuiDialog
      onClose={_onClose}
      {...props}
    />
  )
}