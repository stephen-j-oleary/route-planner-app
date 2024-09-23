"use client";

import React from "react";

import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { handleSave } from "./action";
import { IRoute } from "@/models/Route";
import { usePathname } from "next/navigation";


export type SaveRouteProps =
  & IconButtonProps
  & {
    route: Omit<IRoute, "_id">,
    isCustomer: boolean,
  };

export default function SaveRoute({
  route,
  isCustomer,
  ...props
}: SaveRouteProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  return (
    <Tooltip
      title={!isCustomer ? "Subscription required to save routes" : "Save route"}
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label="Save route"
          disabled={!isCustomer || isPending}
          onClick={() => startTransition(() => handleSave({
            ...route,
            editUrl: pathname,
          }))}
          {...props}
        >
          <BookmarkBorderRounded />
        </IconButton>
      </span>
    </Tooltip>
  );
}