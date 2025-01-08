import { ReactNode } from "react";

import { DialogTitle } from "@mui/material";

import Dialog from "@/components/ui/Dialog";
import DialogClose from "@/components/ui/Dialog/Close";
import pages from "pages";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open
      closeHref={pages.account.root}
    >
      <DialogTitle>
        Change password
      </DialogTitle>

      <DialogClose
        closeHref={pages.account.root}
      />

      {children}
    </Dialog>
  );
}