"use client";

import React from "react";

import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { handleSave } from "./action";
import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";


export type SaveRouteProps =
  & IconButtonProps
  & {
    route: ApiPostUserRouteData,
    isCustomer: boolean,
  };

export default function SaveRoute({
  route,
  isCustomer,
  ...props
}: SaveRouteProps) {
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
          onClick={() => startTransition(() => handleSave(route))}
          {...props}
        >
          <BookmarkBorderRounded />
        </IconButton>
      </span>
    </Tooltip>
  );
}