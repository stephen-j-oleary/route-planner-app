"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SWRResponse } from "swr";

import { ArrowForwardRounded } from "@mui/icons-material";
import { Box, BoxProps, Button } from "@mui/material";

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

  if (
    pathname?.startsWith(pages.login)
    || pathname?.startsWith(pages.verify)
    || pathname?.startsWith(pages.routes.new)
  ) return null;

  return (
    <Box {...props}>
      <Button
        size="medium"
        variant="contained"
        component={Link}
        href={pages.routes.new}
        onClick={() => onClick?.()}
        endIcon={<ArrowForwardRounded />}
      >
        {
          session.data?.user?.id
            ? "Create a route"
            : "Get started"
        }
      </Button>
    </Box>
  );
}