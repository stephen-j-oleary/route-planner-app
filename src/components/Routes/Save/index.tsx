"use server";

import { useMutation } from "@tanstack/react-query";
import { cookies } from "next/headers";

import { BookmarkBorderRounded } from "@mui/icons-material";
import { IconButton, IconButtonProps, Tooltip } from "@mui/material";

import { ApiPostUserRouteData } from "@/app/api/user/routes/route";
import { createUserRoute } from "@/services/routes";
import { auth } from "@/utils/auth";


export type SaveRouteProps =
  & IconButtonProps
  & {
    route: ApiPostUserRouteData,
  };

export default async function SaveRoute({
  route,
  ...props
}: SaveRouteProps) {
  const handleSaveRoute = useMutation({
    mutationFn: createUserRoute,
  });

  const { customerId } = await auth(cookies());

  // Feature requires subscription
  if (!customerId) return null;

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