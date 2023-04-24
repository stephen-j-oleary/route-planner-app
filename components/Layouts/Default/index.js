import Head from "next/head";

import { Box, Stack } from "@mui/material";

import Footer from "./Footer";
import Header from "./Header";


export default function DefaultLayout({
  title,
  headingComponent,
  hideUserMenu,
  disableHeaderOffset,
  headerProps = {},
  footerProps = {},
  children,
  ...props
}) {
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