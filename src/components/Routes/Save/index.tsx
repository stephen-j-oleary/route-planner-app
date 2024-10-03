// TODO: Add success state or redirect to saved route url

"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { handleSave } from "./action";
import { IRoute } from "@/models/Route";

const LABEL = "Save route";


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

  const handleClick = () => startTransition(
    () => handleSave({
      ...route,
      editUrl: pathname,
    })
  );

  return (
    <Tooltip
      title={!isCustomer ? "Subscription required to save routes" : LABEL}
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label={LABEL}
          disabled={!isCustomer || isPending}
          onClick={handleClick}
          {...props}
        >
          <BookmarkBorderRounded />
        </IconButton>
      </span>
    </Tooltip>
  );
}