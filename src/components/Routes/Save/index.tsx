"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { ApiPostUserRouteData } from "@/app/api/user/routes/route";
import { createUserRoute } from "@/services/routes";
import { getSession } from "@/utils/auth/client";


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
    mutationFn: createUserRoute,
  });

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });

  // Feature requires subscription
  if (!sessionQuery.data?.customerId) return null;

  return (
    <Tooltip
      title="Save route"
      enterDelay={800}
    >
      <span>
        <IconButton
          aria-label="Save route"
          disabled={handleSaveRoute.isPending}
          onClick={() => handleSaveRoute.mutate(route)}
          {...props}
        >
          <BookmarkBorderRounded />
        </IconButton>
      </span>
    </Tooltip>
  );
}