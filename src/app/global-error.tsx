"use client";

import { useEffect } from "react";

import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import ViewError from "@/components/ui/ViewError";


export default function Error({
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
      <body style={{ minHeight: "100%" }}>
        <Header />

        <ViewError
          primary="Something went wrong"
          secondary="Please try again later"
        />

        <Footer />
      </body>
    </html>
  );
}