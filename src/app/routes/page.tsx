import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/utils/auth";


export default async function RoutesPage() {
  const { userId } = await auth(cookies());
  if (!userId) redirect("/login");

  return null;
}

export const metadata = {
  title: "Loop Mapping - Routes",
};