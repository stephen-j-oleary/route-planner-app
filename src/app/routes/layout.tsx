import { cookies } from "next/headers";

import Slots, { SlotProps } from "./Slots";
import auth from "@/utils/auth";


export default async function Layout(slots: SlotProps) {
  await auth(cookies()).flow();

  return (
    <Slots {...slots} />
  );
}