import Head from "next/head";
import React from "react";

import { Box, Stack, StackProps } from "@mui/material";

import Footer from "./Footer";
import Header from "./Header";


export type DefaultLayoutProps = StackProps & {
  title: string,
  headingComponent?: React.ElementType,
  hideUserMenu?: boolean,
  disableHeaderOffset?: boolean,
  headerProps?: object,
  footerProps?: object,
  children?: React.ReactNode,
};

export default function DefaultLayout({
  title,
  headingComponent,
  hideUserMenu = false,
  disableHeaderOffset = false,
  headerProps = {},
  footerProps = {},
  children,
  ...props
}: DefaultLayoutProps) {
  return (
    <Box
      display="table"
      width="100%"
      height="100%"
    >
      <Head>
        <title>{[title, "Loop Mapping"].join(" - ")}</title>
      </Head>

      <Header
        titleComponent={headingComponent}
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