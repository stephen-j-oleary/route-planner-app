import { cookies } from "next/headers";
import React from "react";

import { Box, Container } from "@mui/material";

import Slots, { SlotsProps } from "./Slots";
import Title from "./Title";
import NextBreadcrumbs from "@/components/ui/NextBreadcrumbs";
import { auth, authRedirect } from "@/utils/auth";
import pages from "pages";


export default async function Layout(slots: SlotsProps) {
  const { userId } = await auth(cookies());
  if (!userId) authRedirect(pages.login);


  return (
    <Container maxWidth="sm" sx={{ paddingY: 3 }}>
      <Box>
        <Title />

        <NextBreadcrumbs />
      </Box>

      <Slots {...slots} />
    </Container>
  );
}