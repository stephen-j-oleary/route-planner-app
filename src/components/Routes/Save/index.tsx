"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { postUserRoute } from "@/app/api/user/routes/actions";
import { ApiPostUserRouteData } from "@/app/api/user/routes/schemas";
import { getSession } from "@/utils/auth";


export type SaveRouteProps =
  & IconButtonProps
  & {
    route: ApiPostUserRouteData,
  };

export default function SaveRoute({
  route,
  ...props
}: SaveRouteProps) {
  const handleSaveRoute = useMutation({
    mutationFn: postUserRoute,
  });

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });

  // Feature requires subscription
  if (!sessionQuery.data?.customerId || !sessionQuery.data?.userId) return null;

  return (
    <Tooltip
      title="Save route"
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label="Save route"
          disabled={handleSaveRoute.isPending}
          onClick={() => handleSaveRoute.mutate({ ...route, userId: sessionQuery.data.userId! })}
          {...props}
        >
          <BookmarkBorderRounded />
        </IconButton>
      </span>
    </Tooltip>
  );
}