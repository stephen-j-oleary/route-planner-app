"use client";

import { useMutation } from "@tanstack/react-query";

import { BookmarkRounded, DeleteRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { deleteUserRouteById } from "@/app/api/user/routes/[id]/actions";
import { IRoute } from "@/models/Route";


export type DeleteRouteProps = IconButtonProps & {
  route: Pick<IRoute, "_id">,
  isSaved: boolean,
  onSuccess?: () => void,
  onError?: () => void,
  onSettled?: () => void,
}

export default function DeleteRoute({
  route,
  isSaved,
  onSuccess,
  onError,
  onSettled,
  ...props
}: DeleteRouteProps) {
  const handleDeleteRoute = useMutation({
    mutationFn: deleteUserRouteById,
  });

  const label = "Delete route";

  return (
    <Tooltip
      title={label}
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label={label}
          disabled={handleDeleteRoute.isPending}
          onClick={() => handleDeleteRoute.mutate(
            route._id,
            {
              onSuccess,
              onError,
              onSettled,
            }
          )}
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