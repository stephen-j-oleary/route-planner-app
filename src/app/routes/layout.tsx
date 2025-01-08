import { cookies } from "next/headers";

import Slots, { SlotProps } from "./Slots";
import { auth, authRedirect } from "@/utils/auth";
import pages from "pages";


export default async function Layout(slots: SlotProps) {
  const { userId } = await auth(cookies());
  if (!userId) await authRedirect(pages.login);

  return (
    <Slots {...slots} />
  );
}