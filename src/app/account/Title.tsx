"use client";

import { usePathname } from "next/navigation";

import { Typography } from "@mui/material";


export default function Title() {
  const pathname = usePathname();
  const title = pathname
    ?.split("/")
    .filter(v => v)
    .slice(1)
    .join(" ");

  return (
    <Typography variant="h1" textTransform="capitalize">
      {title}
    </Typography>
  )
}