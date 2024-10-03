"use client";

import React from "react";

import { BookmarkRounded, DeleteRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { deleteUserRouteById } from "@/app/api/user/routes/[id]/actions";

const LABEL = "Delete route";


export type DeleteRouteProps = IconButtonProps & {
  route: { id: string },
  isSaved?: boolean,
}

export default function DeleteRoute({
  route,
  isSaved = false,
  ...props
}: DeleteRouteProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleClick = () => startTransition(
    () => void deleteUserRouteById(route.id)
  );


  return (
    <Tooltip
      title={LABEL}
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label={LABEL}
          disabled={isPending}
          onClick={handleClick}
          {...props}
        >
          {
            isSaved
              ? <BookmarkRounded />
              : <DeleteRounded />
          }
        </IconButton>
      </span>
    </Tooltip>
  );
}