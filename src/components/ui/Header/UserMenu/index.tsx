"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SWRResponse } from "swr";

import { PersonRounded } from "@mui/icons-material";
import { Box, BoxProps, Button, IconButton, Tooltip } from "@mui/material";

import pages from "@/pages";
import { AuthData } from "@/utils/auth/utils";
import { appendQuery } from "@/utils/url";

const UserMenuMenu = dynamic(
  () => import("./Menu"),
  { ssr: false },
);


type UserMenuProps =
  & {
    session: SWRResponse<AuthData>,
    onClick?: () => void,
  }
  & BoxProps;

export default function UserMenu({
  session,
  onClick,
  ...props
}: UserMenuProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  if (session.isLoading) return null;

  if (pathname?.startsWith(pages.login)) return null;

  return (
    <Box {...props}>
      {
        session.data?.user?.id
          ? (
            <>
              <Tooltip title="Open user menu">
                <IconButton
                  aria-label="Open user menu"
                  aria-haspopup
                  size="medium"
                  onClick={() => setOpen(true)}
                >
                  <PersonRounded />
                </IconButton>
              </Tooltip>

              <UserMenuMenu
                session={session}
                open={open}
                setOpen={setOpen}
                onClick={onClick}
              />
            </>
          )
          : (
            <Button
              size="medium"
              variant="text"
              component={Link}
              href={appendQuery(pages.login, { callbackUrl: pages.routes.new })}
            >
              Login
            </Button>
          )
      }
    </Box>
  );
}