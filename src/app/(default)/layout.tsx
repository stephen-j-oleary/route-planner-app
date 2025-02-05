import { cookies } from "next/headers";
import { ReactNode } from "react";

import Header from "@/components/ui/Header";
import auth from "@/utils/auth";
import pojo from "@/utils/pojo";


export default async function Layout({
  children,
}: {
  children: ReactNode,
}) {
  const session = pojo(await auth(cookies()).session());

  return (
    <>
      <Header session={session} />

      {children}
    </>
  );
}