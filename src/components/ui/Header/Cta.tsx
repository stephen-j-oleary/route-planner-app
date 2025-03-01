"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SWRResponse } from "swr";

import { InstallDesktopRounded } from "@mui/icons-material";
import { Box, BoxProps, Button } from "@mui/material";

import Install from "../Install";
import pages from "@/pages";
import { AuthData } from "@/utils/auth/utils";


type HeaderCtaProps =
  & {
    session: SWRResponse<AuthData>,
    onClick?: () => void,
  }
  & BoxProps;

export default function HeaderCta({
  session,
  onClick,
  ...props
}: HeaderCtaProps) {
  const pathname = usePathname();

  if (pathname?.startsWith(pages.login)) return null;

  return (
    <Box {...props}>
      {
        pathname?.startsWith(pages.routes.root)
          ? (
            <Install
              renderTrigger={params => (
                <Button
                  size="medium"
                  variant="contained"
                  startIcon={<InstallDesktopRounded />}
                  {...params}
                >
                  Install
                </Button>
              )}
            />
          )
          : (
            <Button
              size="medium"
              variant="contained"
              component={Link}
              href={pages.routes.new}
              onClick={() => onClick?.()}
            >
              {
                session.data?.user?.id
                  ? "Create a route"
                  : "Get started"
              }
            </Button>
          )
      }
    </Box>
  );
}