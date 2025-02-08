import { ReactNode } from "react";

import Header from "@/components/ui/Header";


export default function Layout({
  children,
}: {
  children: ReactNode,
}) {
  return (
    <>
      <Header />

      {children}
    </>
  );
}