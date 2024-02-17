import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

import { Box, Stack, StackProps } from "@mui/material";

import { FooterProps } from "@/components/ui/Layout/Footer";
import Header, { HeaderProps } from "@/components/ui/Layout/Header";

const Footer = dynamic(() => import("@/components/ui/Layout/Footer").then(mod => mod.default));


export type LayoutProps = StackProps & {
  title?: string,
  hideUserMenu?: boolean,
  disableHeaderOffset?: boolean,
  headerProps?: HeaderProps,
  footerProps?: FooterProps,
  children?: React.ReactNode,
};

export default function Layout({
  title,
  hideUserMenu = false,
  disableHeaderOffset = false,
  headerProps = {},
  footerProps = {},
  children,
  ...props
}: LayoutProps) {
  return (
    <Box
      display="table"
      width="100%"
      height="100%"
    >
      <Head>
        <title>
          {
            title
              ? [title, "Loop Mapping"].join(" - ")
              : "Loop Mapping"
          }
        </title>
      </Head>

      <Header
        hideUser={hideUserMenu}
        disableOffset={disableHeaderOffset}
        {...headerProps}
      />

      <Box
        component="main"
        display="table-row"
        height="100%"
        sx={{ backgroundColor: "background.default" }}
      >
        <Stack
          height="100%"
          {...props}
        >
          {children}
        </Stack>
      </Box>

      <Footer {...footerProps} />
    </Box>
  );
}