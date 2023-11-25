import React from "react";

import DefaultLayout, { DefaultLayoutProps } from "@/components/Layouts/Default";


export type ErrorLayoutProps = Omit<DefaultLayoutProps, "headingComponent"> & {
  children: React.ReactNode,
};

export default function ErrorLayout({
  children,
  ...props
}: ErrorLayoutProps) {
  return (
    <DefaultLayout
      headingComponent="p"
      justifyContent="center"
      spacing={3}
      {...props}
    >
      {children}
    </DefaultLayout>
  );
}