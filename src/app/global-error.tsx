"use client";

import { useEffect } from "react";

import Theme from "./Theme";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import ViewError from "@/components/ui/ViewError";
import { font } from "@/styles/constants";


export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string },
}) {
  useEffect(
    () => console.error(error),
    [error]
  );

  return (
    <html lang="en">
      <head />
      <body className={font.variable} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Theme>
          <Header />

          <ViewError
            primary="Something went wrong"
            secondary="Please try again later"
            sx={{ flex: 1, my: 3 }}
          />

          <Footer />
        </Theme>
      </body>
    </html>
  );
}