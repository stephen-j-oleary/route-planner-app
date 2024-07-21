import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

import Slots, { SlotProps } from "./Slots";
import { auth } from "@/utils/auth";
import pages from "pages";


export default async function Layout(slots: SlotProps) {
  const { userId } = await auth(cookies());
  if (!userId) redirect(pages.login);

  return (
    <Slots {...slots} />
  );
}