"use client";

import { useEffect } from "react";

import Body from "./Body";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import ViewError from "@/components/ui/ViewError";


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
    <html>
      <head />
      <Body style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Header />

        <ViewError
          primary="Something went wrong"
          secondary="Please try again later"
          sx={{ flex: 1, my: 3 }}
        />

        <Footer />
      </Body>
    </html>
  );
}