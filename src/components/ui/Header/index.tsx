"use client";

import NextLink from "next/link";
import { useState } from "react";
import useSWR from "swr";

import { AppBar, AppBarProps, Backdrop, Box, Link, Stack, Toolbar } from "@mui/material";

import HeaderCta from "./Cta";
import NavigationMenuCompact, { NavigationMenuCompactToggle } from "./NavigationMenu/Compact";
import NavigationMenuExpanded from "./NavigationMenu/Expanded";
import HeaderOffset from "./Offset";
import UserMenu from "@/components/ui/Header/UserMenu";
import pages from "@/pages";
import { getSession } from "@/utils/auth/client";


export type HeaderProps =
  & Omit<AppBarProps, "variant" | "color">
  & {
    variant?: "compact" | "expanded",
  };

export default function Header({
  position = "fixed",
  variant = "expanded",
  ...props
}: HeaderProps) {
  const session = useSWR(pages.api.session, () => getSession());

  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(v => !v);

  return (
    <>
      <AppBar
        position={position}
        color={(variant === "expanded" || isOpen) ? "default" : "transparent"}
        sx={{
          zIndex: theme => theme.zIndex.appBar,
          boxShadow: (variant === "compact" && !isOpen) ? "none" : undefined,
          transition: "background-color .4s ease-out",
          pointerEvents: (variant === "compact" && !isOpen) ? "none" : "auto",
          "& > *": { pointerEvents: "auto" },
        }}
        {...props}
      >
        <Toolbar
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            gridTemplateRows: "1fr auto",
            columnGap: 4,
            paddingY: 1.5,
            color: "text.primary",
            pointerEvents: (variant === "compact" && !isOpen) ? "none" : "auto",
            "& > *": { pointerEvents: "auto" },
          }}
        >
          <Stack
            direction={{ xs: "row-reverse", md: variant === "expanded" ? "row" : "row-reverse" }}
            justifyContent={{ xs: "flex-end", md: variant === "expanded" ? "flex-start" : "flex-end" }}
            spacing={{ xs: 2, md: variant === "expanded" ? 4 : 2 }}
            sx={{
              pointerEvents: (variant === "compact" && !isOpen) ? "none" : "auto",
              "& > *": { pointerEvents: "auto" },
            }}
          >
            <Link
              component={NextLink}
              href={pages.root}
              underline="none"
              variant="h2"
              color="inherit"
            >
              Loop
            </Link>

            <div>
              <NavigationMenuExpanded
                display={{ xs: "none", md: variant === "expanded" ? "block" : "none" }}
              />

              <NavigationMenuCompactToggle
                open={isOpen}
                onToggle={handleToggle}
                display={{ xs: "block", md: variant === "compact" ? "block" : "none" }}
              />
            </div>
          </Stack>

          <Stack
            direction={session.data?.user?.id ? "row" : "row-reverse"}
            justifyContent={session.data?.user?.id ? "flex-end" : "flex-start"}
            alignItems="center"
            spacing={1}
          >
            <HeaderCta
              session={session}
              onClick={() => setIsOpen(false)}
              display={{
                xs: !isOpen ? "inline-flex" : "none",
                md: (variant === "expanded" || isOpen) ? "inline-flex" : "none",
              }}
            />

            <UserMenu
              session={session}
              onClick={() => setIsOpen(false)}
              display={{
                xs: isOpen ? "block" : "none",
                md: (variant === "expanded" || isOpen) ? "block" : "none",
              }}
            />
          </Stack>
        </Toolbar>

        <Box
          gridColumn="1 / -1"
          display={{ xs: "block", md: variant === "compact" ? "block" : "none" }}
        >
          <NavigationMenuCompact
            open={isOpen}
            onToggle={handleToggle}
          />
        </Box>
      </AppBar>

      <Box
        position="fixed" // Create a stacking context so children are above app content
        zIndex={theme => theme.zIndex.appBar - 1}
        display={{ xs: "block", sm: variant === "compact" ? "block" : "none" }}
      >
        <Backdrop
          open={isOpen}
          onClick={handleToggle}
        />
      </Box>

      {
        position === "fixed" && (
          <HeaderOffset />
        )
      }
    </>
  );
}